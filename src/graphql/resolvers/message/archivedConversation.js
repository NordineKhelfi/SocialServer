import { ApolloError } from "apollo-server-express"
import { Op } from "sequelize";

export default {

    Query: {

        getArchivedConversations: async (_, { offset, limit }, { db, user }) => {
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


            var archivedConversations = await user.getArchivedConversations({
                subQuery: false,
                distinct: true,
                include: [{
                    model: db.Conversation,
                    as: "conversation",
                    required: true,
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
                                        }
                                    },
                                    {
                                        id: {
                                            [Op.notIn]: blockedUsers
                                        }
                                    }, 
                                    {
                                        disabled : false 
                                    }
                                ]

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
                        limit: 1,
                        offset: 0,
                        order: [["createdAt", "DESC"]]
                    }, {
                        model: db.Simat,
                        as: "simat"
                    }],


                }],
                limit: [offset, limit],
                order: [["createdAt", "DESC"]],
            })


            for (var index = 0; index < archivedConversations.length; index++) {
                var conversation = archivedConversations[index].conversation;
                conversation.isReadable = archivedConversations[index].isParticipant;
                conversation.isArchived = true;
                var lastSeenAt = archivedConversations[index].lastSeenAt;
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

            return archivedConversations.map(archive => archive.conversation);
        },


    },


    Mutation: {
        archiveConversation: async (_, { conversationId }, { db, user }) => {
            try {


                const conversation = await db.Conversation.findByPk(conversationId);
                if (!conversation)
                    throw new Error("Converssation not found");


                const [archivedConversation, created] = await db.ArchivedConversation.findOrCreate({
                    where: {
                        conversationId: conversationId,
                        userId: user.id,
                    }
                });

                await archivedConversation.update({
                    createdAt: new Date()
                });

                return archivedConversation;


            } catch (error) {
                return new ApolloError(error.message);
            }
        },


        unArchiveConversation: async (_, { conversationId }, { db, user }) => {
            try {

                const archivedConversation = await db.ArchivedConversation.findOne({
                    where: {
                        conversationId,
                        userId: user.id
                    }
                });


                if (!archivedConversation) {
                    throw new Error("Archived Conversation not found");
                }

                await archivedConversation.destroy();
                return archivedConversation;
            } catch (error) {
                return new ApolloError(error.message);
            }
        },
    }
}