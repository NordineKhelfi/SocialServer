import { ApolloError } from "apollo-server-express"
import { UPLOAD_REPLAYS_RECORDS_DIR } from "../../../config";
import { uploadFiles } from "../../../providers";
import { ReplayValidator } from "../../../validators";

export default {
    Query: {

    },

    Mutation: {
        replay: async (_, { replayInput }, { db, user }) => {
            try {
                // vdalited the input
                await ReplayValidator.validate(replayInput, { abortEarly: true });
                // check if the comment realy exists 
                const comment = await db.Comment.findByPk(replayInput.commentId);

                if (comment == null)
                    throw new Error("Comment not found");

                // if the comment exists and the replay input is valid 
                // assign this replay to the comment 
                replayInput.commentId = comment.id;
                replayInput.comment = comment;

                // cheeck if the replay have media attached to 
                if (replayInput.media) {
                    const output = await uploadFiles([replayInput.media], UPLOAD_REPLAYS_RECORDS_DIR);
                    const media = await db.Media.create({
                        path: output[0]
                    });
                    replayInput.mediaId = media.id;
                    replayInput.media = media;
                }


                // create the comment and assing it to the given post  
                const result = await comment.createReplay(replayInput);
                replayInput.id = result.id;

                return replayInput;



            } catch (error) {
                return new ApolloError(error.message);
            }
        },


        likeReplay: async (_, { replayId }, { db, user }) => {
            try {
                // get the comment and check if it exists 
                const replay = await db.Replay.findByPk(replayId);
                if (replay == null)
                    throw new Error("Comment not found!");

                // check if the user allreadly liked this comment 
                const likedReplays = await user.getReplayLikes({
                    where: {
                        id: replayId
                    }
                });

                if (likedReplays && likedReplays.length > 0) {
                    // unlike the comment 
                    await user.removeReplayLikes(replay);
                    return false;
                } else {
                    // like the comment 
                    await user.addReplayLikes(replay);
                    return true;
                }

            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }
}