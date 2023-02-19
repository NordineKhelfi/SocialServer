import { deleteFiles, uploadFiles } from "../../../providers";
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
                post.media = medium;
                return post;

            } catch (error) {
                return new ApolloError(error.message);
            }
        },
        deletePost: async (_, { postId }, { db, user }) => {
            try {
                // get the post by the given id and belongs to the given user 
                const post = await db.Post.findOne({
                    where: {
                        userId: user.id,
                        id: postId
                    },
                    include: [{
                        model: db.Media,
                        as: "media"
                    }]
                });
                // if the post do not exists return error
                if (post == null)
                    throw new Error("Post not found");

                // check if the post have media content 
                // delete it before removing the post from database 
                if (post.media) {

                    //await post.deleteMedia() ; 
                    post.media.forEach( async entry => { 
                        await entry.destroy() ; 
                    })
                    // delete the files from the storage 
                    await deleteFiles(post.media.map(file => file.path));
                    
                }
                await post.destroy();
                return postId

            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }
}