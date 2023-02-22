import { ApolloError } from "apollo-server-express"
import { UPLOAD_STORIES_DIR } from "../../../config";
import { getStoryExpirationDate, uploadFiles } from "../../../providers";

export default {
    Query: {

    },
    Mutation: {
        createStory: async (_, { storyInput }, { db, user }) => {
            try {
                // get the expiration date 
                storyInput.expiredAt = getStoryExpirationDate();
                // upload the story media to the given directory 
                // and create medaia in the database 
                const outputs = await uploadFiles([storyInput.media], UPLOAD_STORIES_DIR);
                const media = await db.Media.create({
                    path: outputs[0]
                });
                // assign the media id and object 
                storyInput.mediaId = media.id;
                storyInput.media = media;
                // assign the user id 
                // and object
                storyInput.userId = user.id;
                storyInput.user = user;
                
                const story = await db.Story.create(storyInput);
                storyInput.id = story.id;

                return storyInput;


            } catch (error) {
                return new ApolloError(error.message);
            }
        },

        toggleLikeStory: async (_, { storyId }, { db, user }) => {
            try {

                // get the story and ckeck if it's really exiets 
                const story = await db.Story.findByPk(storyId);
                if (story == null)
                    throw new Error("Story Not found");

                // check if the story is allready been liked 
                const storyLikes = await user.getStoryLikes({
                    where: {
                        id: storyId
                    }

                });

                if (storyLikes && storyLikes.length == 0) {
                    // like the story 
                    await user.addStoryLikes(story);
                    return true;
                } else {
                    // unlike the story 
                    await user.removeStoryLikes(story);
                    return false;

                }


            } catch (error) {
                return new ApolloError(error.message);
            }
        },

        commentStory: async (_, { storyCommentInput }, { db, user }) => {
            try {
                // check if the story exists 
                const story = await db.Story.findByPk(storyCommentInput.storyId);
                if (story == null)
                    throw new Error("Story not found");

                // asssign the needed attribues to the story input 
                storyCommentInput.story = story;
                storyCommentInput.userId = user.id;
                storyCommentInput.user = user;

                const result = await user.createStoryComment(storyCommentInput)
                storyCommentInput.id = result.id ; 
                return storyCommentInput ; 

            } catch (error) {
                return new ApolloError(error.message);
            }
        },
    }
}