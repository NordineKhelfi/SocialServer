import { ApolloError } from "apollo-server-express"
import { UPLOAD_COMMENTS_RECORDS_DIR } from "../../../config";
import { uploadFiles } from "../../../providers";
import { CommentValidator } from "../../../validators";

export default {
    Query: {

    },

    Mutation: {
        comment: async (_, { commentInput }, { db, user }) => {

            try {
                //* validate comment input 
                await CommentValidator.validate(commentInput, { abortEarly: true });
                // check if the post really exists 
                const post = await db.Post.findByPk(commentInput.postId);

                if (post == null)
                    throw new Error("post not found");
                // if the post exists and the comment input is valid 
                // assign this comment to the user 
                commentInput.userId = user.id ; 
                commentInput.user = user ; 
                
                
                // cheeck if the comment have media attached to 
                if (commentInput.media) {
                    const output =  await uploadFiles([commentInput.media], UPLOAD_COMMENTS_RECORDS_DIR);
                    const media = await db.Media.create({
                        path: output[0]
                    });
                    commentInput.mediaId = media.id ; 
                    commentInput.media = media ; 
                }

                // create the comment and assing it to the given post  
                const result = await  post.createComment(commentInput) ; 
                commentInput.id = result.id ; 
                commentInput.post = post ; 
                return commentInput ; 

            } catch (error) {
                return new ApolloError(error.message);
            }

            
        }
    }
}