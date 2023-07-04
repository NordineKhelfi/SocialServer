import { ApolloError } from "apollo-server-express"
import { MessageValidator } from "../../../validators";
import {
    UPLOAD_MESSAGE_IMAGES_DIR,
    UPLOAD_MESSAGE_RECORDS_DIR,
    UPLOAD_MESSAGE_VIDEOS_DIR
} from "../../../config";

import { uploadFiles } from "../../../providers";
import { subscribe } from "graphql";
import { Op } from "sequelize";
import { withFilter } from "graphql-subscriptions";


export default {
    Query: {
        getMessages: async (_, { conversationId, offset, limit }, { db, user }) => {
            try {
                // check if the user is a aprticipant in this given conversation 
                const conversationMember = (await user.getConversationMember({
                    where: {
                        conversationId: conversationId
                    }
                })).pop();
                if (conversationMember == null)
                    throw new Error("Not Member of this Conversation");


                const conversation = await conversationMember.getConversation();

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
                // get all the messages that belongs to this conversation between offset and limit 
                // and include the sender and the media content 
                var messages = await conversation.getMessages({
                    include: [{
                        model: db.Media,
                        as: "media",

                    }, {
                        model: db.User,
                        as: "sender",
                        required: true,
                        where: {
                            id: {
                                [Op.notIn]: blockedUsers
                            },
                            disabled: false
                        }

                    }, {
                        model: db.Post,
                        as: "post",
                        include: [{
                            model: db.Media,
                            as: "media"
                        }, {
                            model: db.User,
                            as: "user",
                            include: [{
                                model: db.Media,
                                as: "profilePicture"
                            }]
                        }, {
                            model: db.Reel,
                            as: "reel",
                            include: [{
                                model: db.Media,
                                as: "thumbnail"
                            }]
                        }]
                    }, {
                        model: db.User,
                        as: "account",
                        include: [{
                            model: db.Media,
                            as: "profilePicture"
                        }]
                    }],
                    offset,
                    limit,
                    order: [["createdAt", "DESC"]]
                });



                for (let index = 0; index < messages.length; index++) {
                    if (messages[index].type == "post") {
                        messages[index].post.liked = (await user.getLikes({
                            where: {
                                postId: messages[index].post.id
                            }
                        })).length > 0;

                        messages[index].post.isFavorite = (await user.getFavorites({
                            where: {
                                postId: messages[index].post.id
                            }
                        })).length > 0;
                    }
                }


                return messages;
            } catch (error) {
                return new ApolloError(error.message);
            }
        }

    },
    Mutation: {
        sendMessage: async (_, { messageInput }, { db, user, pubSub, sendPushNotification }) => {



            try {
                // validate the conversation input 
                await MessageValidator.validate(messageInput, { abortEarly: true })
                // check if the user belongs to the given conversation 
                const conversationMember = (await user.getConversationMember({
                    where: {
                        conversationId: messageInput.conversationId
                    }
                })).pop();
                if (!conversationMember)
                    throw new Error("Forbidden : you don't belong to this conversation");

                const conversation = await conversationMember.getConversation();

                // assign the conversation and user as a sender to this message 
                messageInput.conversation = conversation;
                messageInput.conversationId = conversation.id;
                messageInput.userId = user.id;
                messageInput.sender = user;
                messageInput.sender.profilePicture = await user.getProfilePicture();
                // upload the media based on it type 
                // and save the path in output 
                var output;
                if (messageInput.type == "image")
                    output = (await uploadFiles([messageInput.media], UPLOAD_MESSAGE_IMAGES_DIR)).pop();

                if (messageInput.type == "video")
                    output = (await uploadFiles([messageInput.media], UPLOAD_MESSAGE_VIDEOS_DIR)).pop();

                if (messageInput.type == "record")
                    output = (await uploadFiles([messageInput.media], UPLOAD_MESSAGE_RECORDS_DIR)).pop();

                if (output) {
                    // save the media to the database 
                    // and assign it's attributes to the message 
                    const media = await db.Media.create({
                        path: output
                    });

                    messageInput.media = media;
                    messageInput.mediaId = media.id;
                }

                // save the message 
                const message = await db.Message.create(messageInput);
                messageInput.id = message.id;
                messageInput.createdAt = new Date();

                conversation.update({ updatedAt: new Date() })
                const members = await conversation.getMembers({
                    where: {
                        userId: {
                            [Op.not]: user.id
                        }
                    }
                });

                messageInput.conversation.members = members;

                pubSub.publish("NEW_MESSAGE", {
                    newMessage: messageInput
                });

                for (let index = 0; index < members.length; index++) {
                    if (user.id == members[index].userId)
                        continue;

                    const blockedUser = await db.BlockedUser.findOne({
                        where: {
                            [Op.or]: [
                                {
                                    userId: members[index].userId,
                                    blockedUserId: user.id
                                },
                                {
                                    blockedUserId: members[index].userId,
                                    userId: user.id
                                }
                            ]
                        }
                    });
                    
                    if (blockedUser)
                        continue;

                    var sendTo = await members[index].getUser();
                    if (!sendTo.mute || !members[index].allowNotifications)
                        sendPushNotification(
                            sendTo,
                            {
                                type: "message",
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    lastname: user.lastname,
                                    profilePicture: await user.getProfilePicture()
                                },
                                message: {
                                    conversationId: message.conversationId,
                                    type: message.type,
                                    content: message.content
                                }
                            }
                        )
                }

                return messageInput

            } catch (error) {
                console.log(error.message);
                return new ApolloError(error.message);
            }

        },


        sharePost: async (_, { conversationId, postId }, { db, user, pubSub, sendPushNotification }) => {
            try {


                const conversationMemeber = await db.ConversationMember.findOne({
                    where: {
                        userId: user.id,
                        conversationId
                    },
                    include: [{
                        model: db.Conversation,
                        as: "conversation"
                    }]
                });

                if (!conversationMemeber)
                    throw new Error("Not part of this conversation")

                const post = await db.Post.findOne({
                    include: [{
                        model: db.Media,
                        as: "media"
                    }, {
                        model: db.Reel,
                        as: "reel",
                        include: [{
                            model: db.Media,
                            as: "thumbnail"
                        }]
                    }, {
                        model: db.User,
                        as: "user",
                        include: [{
                            model: db.Media,
                            as: "profilePicture"
                        }]
                    }],
                    where: {
                        id: postId
                    }
                });

                if (!post)
                    throw new Error('Post not found')



                var message = await db.Message.create({
                    type: "post",
                    postId: post.id,
                    conversationId: conversationId,
                    userId: user.id
                });


                user.profilePicture = await user.getProfilePicture();
                message.createdAt = new Date();
                message.post = post;
                message.sender = user;
                conversationMemeber.conversation.members = await conversationMemeber.conversation.getMembers({
                    where: {
                        userId: {
                            [Op.not]: user.id
                        }
                    }
                });
                message.conversation = conversationMemeber.conversation;
                message.conversation.update({ updatedAt: new Date() })

                pubSub.publish("NEW_MESSAGE", {
                    newMessage: message
                });

                var members = message.conversation.members;

                for (let index = 0; index < members.length; index++) {

                    if (user.id == members[index].userId)
                        continue;
                    const blockedUser = await db.BlockedUser.findOne({
                        where: {
                            [Op.or]: [
                                {
                                    userId: members[index].userId,
                                    blockedUserId: user.id
                                },
                                {
                                    blockedUserId: members[index].userId,
                                    userId: user.id
                                }
                            ]
                        }
                    });

                    if (blockedUser)
                        continue;
                    var sendTo = await members[index].getUser();

                    if (!sendTo.mute || !members[index].allowNotifications)
                        sendPushNotification(
                            sendTo,
                            {
                                type: "message",
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    lastname: user.lastname,
                                    profilePicture: await user.getProfilePicture()
                                },
                                message: {
                                    conversationId: message.conversationId,
                                    type: message.type,
                                    content: message.content
                                }
                            }
                        )
                }


                return message;
            } catch (error) {
                return new ApolloError(error.message);
            }
        },


        shareAccount: async (_, { userId, conversationId }, { db, user, pubSub, sendPushNotification }) => {
            try {

                const conversationMemeber = await db.ConversationMember.findOne({
                    where: {
                        userId: user.id,
                        conversationId
                    },
                    include: [{
                        model: db.Conversation,
                        as: "conversation"
                    }]
                });

                if (!conversationMemeber)
                    throw new Error("Not part of this conversation")

                const account = await db.User.findOne({
                    include: [{
                        model: db.Media,
                        as: "profilePicture"
                    }],
                    where: {
                        id: userId,
                        disabled: false
                    }
                });

                if (!account)
                    throw new Error("Shared Account not found");


                var message = await db.Message.create({
                    type: "account",
                    accountId: account.id,
                    conversationId: conversationId,
                    userId: user.id
                });


                message.createdAt = new Date();
                message.account = account;
                message.sender = user;


                conversationMemeber.conversation.members = await conversationMemeber.conversation.getMembers({
                    where: {
                        userId: {
                            [Op.not]: user.id
                        }
                    }
                });
                message.conversation = conversationMemeber.conversation;
                message.conversation.update({ updatedAt: new Date() })

                pubSub.publish("NEW_MESSAGE", {
                    newMessage: message
                });

                var members = message.conversation.members;

                for (let index = 0; index < members.length; index++) {

                    if (user.id == members[index].userId)
                        continue;
                    const blockedUser = await db.BlockedUser.findOne({
                        where: {
                            [Op.or]: [
                                {
                                    userId: members[index].userId,
                                    blockedUserId: user.id
                                },
                                {
                                    blockedUserId: members[index].userId,
                                    userId: user.id
                                }
                            ]
                        }
                    });

                    if (blockedUser)
                        continue;

                    var sendTo = await members[index].getUser();                    
                    if (!sendTo.mute || !members[index].allowNotifications)

                        sendPushNotification(
                            sendTo,
                            {
                                type: "message",
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    lastname: user.lastname,
                                    profilePicture: await user.getProfilePicture()
                                },
                                message: {
                                    conversationId: message.conversationId,
                                    type: message.type,
                                    content: message.content
                                }
                            }
                        )
                }

                return message;

            } catch (error) {

                return new ApolloError(error.message);
            }
        }
    },
    Subscription: {
        newMessage: {
            subscribe: withFilter(
                (_, { }, { pubSub }) => pubSub.asyncIterator(`NEW_MESSAGE`),


                async ({ newMessage }, { }, { isUserAuth, user }) => {

                    if (!isUserAuth)
                        return false;

                    if (newMessage.type == "post") {
                        newMessage.post.liked = (await user.getLikes({
                            where: {
                                postId: user.id
                            }
                        })).pop() != null;
                        newMessage.post.isFavorite = (await user.getFavorites({
                            where: {
                                postId: user.id
                            }
                        })).pop() != null;
                    }


                    const blockedUser = await db.BlockedUser.findOne({
                        where: {
                            [Op.or]: [
                                {
                                    userId: newMessage.sender.id,
                                    blockedUserId: user.id
                                },
                                {
                                    blockedUserId: newMessage.sender.id,
                                    userId: user.id
                                }
                            ]
                        }
                    });

                    if (blockedUser)
                        return false;

                    const index = newMessage.conversation.members.findIndex(member => member.userId == user.id);
                    return index >= 0;

                })

        }
    }
}
