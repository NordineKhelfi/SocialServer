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

                // get all the messages that belongs to this conversation between offset and limit 
                // and include the sender and the media content 
                return await conversation.getMessages({
                    include: [{
                        model: db.Media,
                        as: "media",

                    }, {
                        model: db.User,
                        as: "sender"
                    }],
                    offset,
                    limit,
                    order: [["createdAt", "DESC"]]
                });

            } catch (error) {
                return new ApolloError(error.message);
            }
        }

    },
    Mutation: {
        sendMessage: async (_, { messageInput }, { db, user, pubSub }) => {



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



                return messageInput

            } catch (error) {
                return new ApolloError(error.message);
            }

        }
    },
    Subscription: {
        newMessage: {
            subscribe: withFilter(
                (_, { }, { pubSub }) => pubSub.asyncIterator(`NEW_MESSAGE`),
                ({ newMessage }, { }, { isUserAuth, user }) => {
                    
                    if (!isUserAuth) 
                        return false ; 
                    
                    const index = newMessage.conversation.members.findIndex(member => member.userId == user.id) ; 
                    return index >= 0 ; 
                    
                })

        }
    }
}
