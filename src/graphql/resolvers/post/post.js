import { uploadFiles } from "../../../providers";
import { UPLOAD_POST_IMAGES_DIR, UPLOAD_POST_VIDEOS_DIR } from "../../../config";
import { GraphQLUpload } from "graphql-upload";
import { ApolloError } from "apollo-server-express";
import { PostValidator } from "../../../validators/post";

export default {
    Upload: GraphQLUpload,
    Query: {

    },

    Mutation: {
        createPost: async (_, { postInput }, { db, user }) => {

            try {
                // vdaliate post input 
                await PostValidator.validate(postInput, { abortEarly: true });
                // create the post and assign it to the given user 
                const post = await user.createPost(postInput);
                // if the post is media for upload the media and assign it to the post 

                var outputs = []; var medium = [];

                // check if the content is image or reel 
                // uploda the content files and assign the paths to the outputs array 
                if (post.type == "image")
                    outputs = await uploadFiles(postInput.media, UPLOAD_POST_IMAGES_DIR);

                if (post.type == "reel")
                    outputs = await uploadFiles(postInput.media, UPLOAD_POST_VIDEOS_DIR);


                for (let index = 0; index < outputs.length; index++) {
                    // insert media into database 
                    // add it to the post 
                    const media = await db.Media.create({
                        path: outputs[index]
                    });
                
                    await post.addMedia(media);
                    medium.splice(0, 0, media);
                }
                // assign all the uploaded media to the media attribute 
                post.media = medium ; 
                return post;

            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }
}