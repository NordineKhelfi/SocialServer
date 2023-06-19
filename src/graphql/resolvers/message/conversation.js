import { ApolloError } from "apollo-server-express";
import { withFilter } from "graphql-subscriptions";
import { Op, Sequelize } from "sequelize";
import { deleteFiles } from "../../../providers";

export default {

    Query: {
        getConversations: async (_, { asParticipant = true, query, offset, limit }, { db, user }) => {
            // get all the conversations that the given user is member on 
            // and include in each one the members 
            // the last message send and his sender 

            if (!query)
                query = "";




            query = query.trim().split(" ").filter(word => word != "").join(" ");

            var typeFilter = {
                where: {}
            }

            if (query.length > 0)
                typeFilter.where.type = "individual";


            var blockedUsers = await db.BlockedUser.findAll({
                where: {
                    [Op.or]: [
                        {
                            blockedUserId: user.id
                        },
                        {
                            userId: user.id
                        }
                    ]
                }
            });


            blockedUsers = blockedUsers.map(blockedUser => {
                return (blockedUser.userId == user.id) ? (blockedUser.blockedUserId) : (blockedUser.userId)
            })

            try {

                var conversationMembers = await user.getConversationMember({
                    distinct: true,
                    subQuery: false,
                    include: [{

                        model: db.Conversation,
                        as: "conversation",
                        required: true,
                        ...typeFilter,
                        include: [{
                            model: db.ConversationMember,
                            as: "members",

                            required: true,
                            include: [{
                                model: db.User,
                                as: "user",

                                where: {

                                    [Op.and]: [
                                        {
                                            id: {
                                                [Op.not]: user.id
                                            },
                                        }, {
                                            id: {
                                                [Op.notIn]: blockedUsers
                                            }
                                        }, {
                                            [Op.or]: [
                                                Sequelize.where(
                                                    Sequelize.fn("CONCAT", Sequelize.col("name"), Sequelize.col("lastname")), {
                                                    [Op.like]: `%${query}%`
                                                }
                                                ),
                                                Sequelize.where(
                                                    Sequelize.fn("CONCAT", Sequelize.col("lastname"), Sequelize.col("name")), {
                                                    [Op.like]: `%${query}%`
                                                }),
                                                {
                                                    username: {
                                                        [Op.like]: `%${query}%`
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            disabled: false
                                        }
                                    ]
                                },
                                include: [{
                                    model: db.Media,
                                    as: "profilePicture"
                                }]
                            }]
                        },
                        {
                            model: db.Message,
                            as: "messages",

                            include: [{
                                model: db.User,
                                as: "sender",
                            }],
                            limit: 1,
                            offset: 0,
                            order: [["createdAt", "DESC"]]
                        },
                        {
                            model: db.Simat,
                            as: "simat"
                        }],

                    }],


                    where: {
                        isParticipant: asParticipant
                    },

                    limit: [offset, limit],
                    order: [["conversation", "updatedAt", "DESC"]],
                });


                for (var index = 0; index < conversationMembers.length; index++) {
                    var conversation = conversationMembers[index].conversation;
                    conversation.isReadable = conversationMembers[index].isParticipant;
                    var lastSeenAt = conversationMembers[index].lastSeenAt;
                    if (conversation)
                        conversation.unseenMessages = 0;

                    var filterQuery = {};
                    if (lastSeenAt) {
                        filterQuery = {
                            createdAt: {
                                [Op.gt]: lastSeenAt
                            }

                        }
                    }




                    if (conversation && conversation.messages && conversation.messages.length > 0) {
                        var sender = conversation.messages[0].sender;

                        if (sender && sender.id != user.id) {
                            const unseenMessages = await conversation.getMessages({
                                where: {
                                    userId: sender.id,
                                    ...filterQuery
                                }
                            });

                            conversation.unseenMessages = unseenMessages.length;
                        }
                    }
                }



                var conversations = conversationMembers.map(conversationMember => conversationMember.conversation);

                return conversations;
            } catch (error) {
                console.log(error.message)
            }
        },

        getConversation: async (_, { userId, type }, { db, user }) => {
            try {
                // if there is no type set 
                // then make it a indivitual conversation 
                if (!type) {
                    type = "individual";
                }



                var memberShip = (await user.getConversationMember({

                    include: [{
                        model: db.Conversation,
                        as: "conversation",
                        include: [{
                            model: db.ConversationMember,
                            as: "members",
                            where: {
                                userId: userId
                            },
                            include: [{
                                model: db.User,
                                as: "user",

                            }]
                        }, {
                            model: db.Simat,
                            as: "simat"
                        }],
                        where: {
                            type: type
                        }
                    }]
                })).pop();


                if (memberShip) {
                    memberShip.conversation.isReadable = memberShip.asParticipant;
                    return memberShip.conversation
                }
                else
                    return null;


            } catch (error) {
                return new ApolloError(error.message);
            }
        },

        getUnReadConversations: async (_, { asParticipant = true }, { db, user }) => {
            try {

                var conversationMembers = await user.getConversationMember({
                    include: [{
                        model: db.Conversation,
                        as: "conversation",
                        required: true,
                        include: [{
                            model: db.Message,
                            as: "messages",
                            required: true,
                            order: [["createdAt", "DESC"]],
                            where: {
                                userId: {
                                    [Op.not]: user.id
                                },
                                createdAt: {
                                    [Op.gt]: { [Op.col]: "ConversationMember.lastSeenAt" }
                                }

                            },
                        }]
                    }],
                    where: {
                        isParticipant: asParticipant
                    }
                });


                return conversationMembers;
                return conversationMembers.map(conversationMember => conversationMember.conversation);
            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    },

    Mutation: {
        createConversation: async (_, { members }, { db, user }) => {
            try {
                // get user memebers and validate their existens 
                if (members.length != 1)
                    throw new Error("Conversation member do not exists");

                const userMember = await db.User.findByPk(members[0]);
                if (userMember == null)
                    throw new Error("User do not exists");

                // create the conversation 
                const conversation = await db.Conversation.create({
                    type: "individual"
                });


                const isFollower = (await user.getFollowers({
                    where: {
                        userId: userMember.id
                    }
                })).pop() != null;
                // add the creator of the conversation 
                // and add the target user to communicate with  

                conversation.members = [

                    await db.ConversationMember.create({
                        conversationId: conversation.id,
                        userId: user.id,
                        isParticipant: true
                    }),
                    await db.ConversationMember.create({
                        conversationId: conversation.id,
                        userId: userMember.id,
                        isParticipant: isFollower

                    }),

                ]

                conversation.members[0].user = user;
                conversation.members[1].user = userMember;


                conversation.messages = [];
                return conversation

            } catch (error) {
                return new ApolloError(error.message);
            }
        },
        createGroup: async (_, { members }, { db, user }) => {
            try {
                // quick check in case members array is empty or contain one member  
                if (members.length <= 1)
                    throw Error("in group conversation their should be at least 2 members");

                // get user member and check if it's all of them real users
                // loop over them and get user from database by id 
                // if the user not found throw an error to break the thread 
                // else push it to the user table 



                var users = [
                    {
                        ...(user.dataValues),
                        isParticipant: true
                    }
                ];


                for (let index = 0; index < members.length; index++) {
                    var userMember = await db.User.findByPk(members[index]);
                    if (userMember == null)
                        throw new Error("User " + members[index] + " not found");

                    userMember.isParticipant = (await user.getFollowers({
                        where: {
                            userId: userMember.id
                        }
                    })).pop() != null;
                    users.push(userMember);
                }

                // if we reach this level all members are real users in the system 
                // create the conversation as a grouup conversation  
                const conversation = await db.Conversation.create({
                    type: "group"
                });

                var conversationMembers = [];

                for (let index = 0; index < users.length; index++) {
                    conversationMembers.push(await db.ConversationMember.create({
                        conversationId: conversation.id,
                        userId: users[index].id,
                        isParticipant: users[index].isParticipant
                    }))
                }
                conversation.members = conversationMembers;
                conversation.messages = [];
                return conversation;
            } catch (error) {
                console.log(error.message);
                return new ApolloError(error.message)
            }
        },


        deleteConversation: async (_, { conversationId }, { db, user }) => {
            try {
                const conversationMember = await db.ConversationMember.findOne({
                    where: {
                        conversationId: conversationId,
                        userId: user.id
                    },
                    include: [{
                        model: db.Conversation,
                        as: "conversation",

                        include: [{
                            model: db.Message,
                            as: "messages",
                            include: [{
                                model: db.Media,
                                as: "media"
                            }]
                        }, {
                            model: db.ConversationMember,
                            as: "members"
                        }],
                    }]
                });

                if (!conversationMember)
                    throw new Error("Not part of this conversation");

                const conversation = conversationMember.conversation;
             
                var media = [];

                if (conversation.type === "individual" || (conversation.type === "group" && conversation.members.length == 2)) {
                    media = conversation.messages.filter(message => message.media).map(message => message.media);
                    
                    await conversation.destroy();

                } else if (conversation.members.length > 2) {
                    var myMessages = await db.Message.findAll({
                        where: {
                            userId: user.id,
                            conversationId: conversationId
                        }
                    });
                    media = myMessages.filter(message => message.media).map(message => message.media);
                    var archivedConversation = await db.ArchivedConversation.findOne({
                        where: {
                            userId: user.id,
                            conversationId: conversation.id
                        }
                    });


                    if (archivedConversation) {
                        await archivedConversation.destroy();
                    }
                    for (let index = 0; index < myMessages.length; index++) {
                        await myMessages[index].destroy();
                    }


                    await conversationMember.destroy();
                }

                for ( let index = 0 ; index < media.length ; index ++) { 
                    await media[index].destroy()
                }
                await deleteFiles(media.map(m => m.path));
                return conversation;

            } catch (error) {
                return new ApolloError(error.message);
            }

        },
        seeConversation: async (_, { conversationId }, { db, user, pubSub }) => {
            try {

                var conversationMember = (await user.getConversationMember({
                    include: [{
                        model: db.Conversation,
                        as: "conversation",
                        include: [{
                            model: db.ConversationMember,
                            as: "members",
                            where: {
                                userId: {
                                    [Op.not]: user.id
                                }
                            }
                        }]
                    }],
                    where: {
                        conversationId: conversationId,
                    }
                })).pop();

                if (conversationMember == null)
                    throw new Error("You are not allowed to access this conversation .");

                const currentTimeTamps = new Date();
                conversationMember = await conversationMember.update({ lastSeenAt: currentTimeTamps });

                pubSub.publish("CONVERSATION_SAW", {
                    conversationSaw: conversationMember
                });

                return currentTimeTamps;

            } catch (error) {
                return new ApolloError(error.message);
            }
        },


        acceptConversationInvite: async (_, { conversationId }, { db, user }) => {
            try {
                const conversationMember = await db.ConversationMember.findOne({
                    where: {
                        conversationId: conversationId,
                        userId: user.id
                    },
                    include: [{
                        model: db.Conversation,
                        as: "conversation"
                    }]
                });



                if (conversationMember.isParticipant == false) {



                    await conversationMember.update({
                        isParticipant: true
                    })

                    await conversationMember.conversation.update({
                        updatedAt: new Date()
                    })

                };


                return conversationMember;
            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    },
    Subscription: {
        conversationSaw: {
            subscribe: withFilter(
                (_, { }, { pubSub }) => pubSub.asyncIterator(`CONVERSATION_SAW`),
                ({ conversationSaw }, { }, { isUserAuth, user }) => {

                    if (!isUserAuth)
                        return false;

                    const index = conversationSaw.conversation.members.findIndex(member => member.userId == user.id);

                    return index >= 0;


                }
            )
        }
    }
}