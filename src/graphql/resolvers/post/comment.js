import { ApolloError } from "apollo-server-express"
import { UPLOAD_COMMENTS_RECORDS_DIR } from "../../../config";
import { uploadFiles } from "../../../providers";
import { CommentValidator } from "../../../validators";

export default {
    Query: {
        getPostComments: async (_, { postId, offset, limit }, { db, user }) => {
            try {

                // check if the post exists 
                const post = await db.Post.findByPk(postId);
                if (post == null)
                    throw new Error("Post not Found");

                // get all the comments for the given post
                // and includes the replays and the media
                var comments = await post.getComments({

                    include: [
                        {
                            model: db.Media,
                            as: "media"
                        },
                        {
                            model: db.Replay,
                            as: "replays",

                        },
                        {
                            model: db.User,
                            as: "user",
                            include: [{
                                model: db.Media,
                                as: "profilePicture"
                            }]
                        }

                    ],
                    order: [
                        ["id", "DESC"]
                    ],
                    offset: offset,
                    limit: limit,
                });

                // count the replays and assign it to the numReplays attribute 
                // and check if this comment is allready been liked by the user or not  
                for (let index = 0; index < comments.length; index++) {
                    comments[index].numReplays = comments[index].replays.length;
                    comments[index].liked = (await user.getCommentLikes({
                        where: {
                            id: comments[index].id
                        }
                    })).length > 0;
                }
                return comments;

            } catch (error) {
                return new ApolloError(error.message);
            }


        },
        getCommentById: async (_, { commentId }, { db, user }) => {
            try {

                // get all the comments for the given post
                // and includes the replays and the media
                var comment = await db.Comment.findOne({

                    include: [
                        {
                            model: db.Media,
                            as: "media"
                        },
                        {
                            model: db.Replay,
                            as: "replays",

                        },
                        {
                            model: db.Post,
                            as: "post"
                        },
                        {
                            model: db.User,
                            as: "user",
                            include: [{
                                model: db.Media,
                                as: "profilePicture"
                            }]
                        }
                    ],
                    where: {
                        id: commentId
                    },
                });

                // count the replays and assign it to the numReplays attribute 
                // and check if this comment is allready been liked by the user or not  

                if (comment) {
                    comment.numReplays = comment.replays.length;
                  
                    comment.liked = (await user.getCommentLikes({
                        where: {
                            id: comment.id
                        }
                    })).length > 0;
                }
                return comment;


            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    },

    Mutation: {
        comment: async (_, { commentInput }, { db, user, sendPushNotification }) => {

            try {
                //* validate comment input 
                await CommentValidator.validate(commentInput, { abortEarly: true });
                // check if the post really exists 
                const post = await db.Post.findByPk(commentInput.postId);

                if (post == null)
                    throw new Error("post not found");
                // if the post exists and the comment input is valid 
                // assign this comment to the user 
                commentInput.userId = user.id;
                commentInput.user = user;

                // cheeck if the comment have media attached to 
                if (commentInput.media) {
                    const output = await uploadFiles([commentInput.media], UPLOAD_COMMENTS_RECORDS_DIR);
                    const media = await db.Media.create({
                        path: output[0]
                    });
                    commentInput.mediaId = media.id;
                    commentInput.media = media;
                }

                // create the comment and assing it to the given post  
                const result = await post.createComment(commentInput);
                commentInput.id = result.id;
                commentInput.post = post;



                await post.update({
                    numComments: post.numComments + 1
                });

                if (user.id != post.userId)
                    sendPushNotification(
                        await await post.getUser(),
                        {
                            type: "post-comment",
                            post: {
                                id: post.id,
                                title: post.title,
                                type: post.type
                            },
                            comment: {
                                id : result.id , 
                                comment: commentInput.comment,
                                isRecord: commentInput.media != null,
                                user: {
                                    name: user.name,
                                    lastname: user.lastname,
                                    profilePicture: await user.getProfilePicture()
                                }

                            }
                        }
                    )


                return commentInput;

            } catch (error) {
                return new ApolloError(error.message);
            }
        },
        likeComment: async (_, { commentId }, { db, user }) => {

            try {
                // get the comment and check if it exists 
                const comment = await db.Comment.findByPk(commentId);
                if (comment == null)
                    throw new Error("Comment not found!");

                // check if the user allreadly liked this comment 
                const likedComments = await user.getCommentLikes({
                    where: {
                        id: commentId
                    }
                });

                if (likedComments && likedComments.length > 0) {
                    // unlike the comment 
                    await user.removeCommentLikes(comment);
                    return false;
                } else {
                    // like the comment 
                    await user.addCommentLikes(comment);
                    return true;
                }

            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }
}