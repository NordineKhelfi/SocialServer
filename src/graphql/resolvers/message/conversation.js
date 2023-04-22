import { ApolloError } from "apollo-server-express";
import { withFilter } from "graphql-subscriptions";
import { Op } from "sequelize";

export default {

    Query: {
        getConversations: async (_, { offset, limit }, { db, user }) => {
            // get all the conversations that the given user is member on 
            // and include in each one the members 
            // the last message send and his sender 
            try {

                var conversationMembers = await user.getConversationMember({
               
                    include: [{
                        model: db.Conversation,
                        as: "conversation",
                        include: [{
                            model: db.ConversationMember,
                            as: "members",
                            include: [{
                                model: db.User,
                                as: "user",
                                where: {
                                    id: {
                                        [Op.not]: user.id
                                    }
                                },
                                include: [{
                                    model: db.Media,
                                    as: "profilePicture"
                                }]
                            }]

                        }, {
                            model: db.Message,
                            as: "messages",
                            include: [{
                                model: db.User,
                                as: "sender",
                            }],
                            offset: 0,
                            limit: 1,
                            order: [["id", "DESC"]]
                        }],
                    }],
                    offset,
                    limit,
                    order: [["id", "DESC"]]
                });
              
                
                for (var index = 0; index < conversationMembers.length; index++) {
                    var conversation = conversationMembers[index].conversation;
                    var lastSeenAt = conversationMembers[index].lastSeenAt;
                    conversation.unseenMessages = 0;

                    var filterQuery = {};
                    if (lastSeenAt) {
                        filterQuery = {
                            createdAt: {
                                [Op.gt]: lastSeenAt
                            }

                        }
                    }




                    if (conversation.messages && conversation.messages.length > 0) {
                        var sender = conversation.messages[0].sender;
                        if (sender.id != user.id) {
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
                        }],
                        where: {
                            type: type
                        }
                    }]
                })).pop();


                if (memberShip)
                    return memberShip.conversation
                else
                    return null;


                /*
                if (conversation && conversation.length )
                return conversation && conversation
                */

                // get the conversation between the user and the user by the given id 
                var conversations = await db.Conversation.findAll({
                    include: [{
                        model: db.ConversationMember,
                        as: "members",
                        where: {
                            userId: user.id
                        },
                        include: [{
                            model: db.User,
                            as: "user",

                        }]
                    }],
                    where: {
                        type: type
                    }
                })

                var conversation = null

                for (let index = 0; index < conversations.length; index++) {
                    const fIndex = conversations[index].members.findIndex(member => member.userId == userId)
                    if (fIndex >= 0) {
                        conversation = conversations[index];
                        break;
                    }
                }

                return conversation;

                return null;
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

                // add the creator of the conversation 
                // and add the target user to communicate with  

                conversation.members = [

                    await db.ConversationMember.create({
                        conversationId: conversation.id,
                        userId: user.id
                    }),
                    await db.ConversationMember.create({
                        conversationId: conversation.id,
                        userId: userMember.id,

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
                var users = [];
                for (let index = 0; index < members.length; index++) {
                    var userMember = await db.User.findByPk(members[index]);
                    if (userMember == null)
                        throw new Error("User " + members[index] + " not found");
                    users.push(userMember);
                }
                // if we reach this level all members are real users in the system 
                // create the conversation as a grouup conversation  
                const conversation = await db.Conversation.create({
                    type: "group"
                });

                // add the creator of the group 
                await conversation.addMember(user);
                // add the members 
                for (let index = 0; index < users.length; index++)
                    await conversation.addMember(users[index]);

                conversation.members = [user, ...users];
                conversation.messages = [];
                return conversation;
            } catch (error) {
                return new ApolloError(error.message)
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
                })

                return currentTimeTamps;

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