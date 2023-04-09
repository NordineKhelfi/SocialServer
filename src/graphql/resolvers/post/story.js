import { ApolloError } from "apollo-server-express"
import { UPLOAD_STORIES_DIR } from "../../../config";
import { getStoryExpirationDate, uploadFiles } from "../../../providers";
import { Op } from "sequelize";

export default {
    Query: {
        getUserStories: async (_, { userId }, { db, user }) => {
            try {
                const storyUser = await db.User.findByPk(userId);
                if (storyUser == null)
                    throw new Error("User not found");

                var stories =await db.Story.findAll({
                    where: {
                        userId: storyUser.id
                    },
                    include: [
                        {
                            model: db.Media,
                            as: "media"
                        }
                    ]
                }) ;
                for (var index = 0 ; index < stories.length ; index ++) {
                    stories[index].liked  =( await  user.getStoryLikes({
                        where : {
                            id : stories[index].id 
                        }
                    })).length > 0 ; 
                }

                return stories;

            } catch (error) {
                return new ApolloError(error.message)
            }
        },


        getStories: async (_, { offset, limit }, { db, user }) => {


            try {

                // get all folllowers with their stories 
                var following = await user.getFollowing({
                    include: [{
                        model: db.User,
                        as: "following",


                        include: [{
                            model: db.Story,
                            as: "stories",

                            where: {
                                id: {
                                    [Op.not]: null
                                }
                            },
                            include: [{
                                model: db.Media,
                                as: "media"
                            }]
                        }, {
                            model: db.Media,
                            as: "profilePicture"
                        }],
                    }],
                    offset,
                    limit
                });


                console.log(following);

                // check wich story is liked 
                for (let fIndex = 0; fIndex < following.length; fIndex++) {
                    for (var index = 0; index < following[fIndex].following.stories.length; index++) {
                        following[fIndex].following.stories[index].liked = (await user.getStoryLikes({
                            where: {
                                id: following[fIndex].following.stories[index].id
                            }
                        })).length > 0;

                    }
                }

                return following
            } catch (error) {
                return new ApolloError(error.message)
            }


        }
    },
    Mutation: {
        createStory: async (_, { storyInput }, { db, user }) => {
            try {
                // get the expiration date 
                storyInput.expiredAt = getStoryExpirationDate();
                console.log(storyInput.expiredAt);
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
                storyInput.createdAt = story.createdAt;

                return storyInput;


            } catch (error) {
                console.log(error.message)
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
                storyCommentInput.id = result.id;
                return storyCommentInput;

            } catch (error) {
                return new ApolloError(error.message);
            }
        },
    }
}