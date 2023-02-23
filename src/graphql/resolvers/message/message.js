import { ApolloError } from "apollo-server-express"
import { MessageValidator } from "../../../validators";
import {
    UPLOAD_MESSAGE_IMAGES_DIR,
    UPLOAD_MESSAGE_RECORDS_DIR,
    UPLOAD_MESSAGE_VIDEOS_DIR
} from "../../../config";

import { uploadFiles } from "../../../providers";


export default {
    Query: {

    },
    Mutation: {
        sendMessage: async (_, { messageInput }, { db, user }) => {

            try {
                // validate the conversation input 
                await MessageValidator.validate(messageInput, { abortEarly: true })
                // check if the user belongs to the given conversation 
                const conversation = (await user.getConversations({
                    where: {
                        id: messageInput.conversationId
                    }
                })).pop();
                if (!conversation)
                    throw new Error("Forbidden : you don't belong to this conversation");

                // assign the conversation and user as a sender to this message 
                messageInput.conversation = conversation;
                messageInput.userId = user.id;
                messageInput.user = user;


     
                

                // upload the media based on it type 
                // and save the path in output 
                var output;
                if (messageInput.type == "image")
                    output = (await uploadFiles([messageInput.media], UPLOAD_MESSAGE_IMAGES_DIR)).pop();

                if (messageInput.type == "video")
                    output = (await uploadFiles([messageInput.media], UPLOAD_MESSAGE_VIDEO_DIR)).pop();

                if (messageInput.type == "record")
                    output = (await uploadFiles([messageInput.media], UPLOAD_MESSAGE_RECORD_DIR)).pop();

                if (output) {
                    // save the media to the database 
                    // and assign it's attributes to the message 
                    const media = await db.Media.create({ 
                        path : output
                    }) ; 

                    messageInput.media = media ; 
                    messageInput.mediaId = media.id ;  
                }

                // save the message 
                const message = await db.Message.create(messageInput) ; 
                messageInput.id = message.id  ; 
                return messageInput

            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }
}