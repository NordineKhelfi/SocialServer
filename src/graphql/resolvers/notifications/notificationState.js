import { ApolloError } from "apollo-server-express"
import { Op } from "sequelize";

export default {
    Query: {
        getNotificationState: async (_, { }, { db, user }) => {
            try {


                // try to find or create new notification state 
                var [notificaitonsState, created] = await db.NotificationsState.findOrCreate({
                    where: {
                        userId: user.id
                    }
                });


                if (!notificaitonsState)
                    throw new Error("Cant find or create notificationState");


                // get followers that follows the given user after the sawFollowNotificationAt date
                var filter = {
                    where: {}
                }

                if (notificaitonsState.sawFollowNotificationAt)
                    filter.where = {
                        createdAt: {
                            [Op.gt]: notificaitonsState.sawFollowNotificationAt
                        }
                    }
                // get all the followers that starts to follow the given user from the sawFollowNotificationAt date 
                // or if sawFollowNotificationAt is not set then count all the followers
                var followers = await user.countFollowers(filter);
                notificaitonsState.unseenFollowNotification = followers;

                // clear the filter 
                filter = {
                    where: {}
                }
                // check if sawLikeNotificationAt is set 

                if (notificaitonsState.sawLikeNotificationAt)
                    filter.where = {
                        createdAt: {
                            [Op.gt]: notificaitonsState.sawLikeNotificationAt
                        }
                    }

                // count all likes that belongs to the given user posts except his 
                var likes = await db.Like.count({
                    where: {
                        userId: {
                            [Op.not]: user.id
                        },
                        ...filter.where
                    },
                    include: [{
                        model: db.Post,
                        as: "post",
                        where: {
                            userId: user.id
                        }
                    }]
                });
                notificaitonsState.unseenLikeNotification = likes;
                // clear the filter 
                filter = {
                    where: {}
                }
                // apply filter by time if sawCommentNotificationAt is set 
                // we gonna use the same filter for lla type of comments ( post comment , replays , story comment )
                if (notificaitonsState.sawCommentNotificationAt)
                    filter.where = {
                        createdAt: {
                            [Op.gt]: notificaitonsState.sawCommentNotificationAt
                        }
                    }
                var comments = await db.Comment.count({
                    where: {
                        userId: {
                            [Op.not]: user.id
                        },
                        ...filter.where
                    },
                    include: [{
                        model: db.Post,
                        as: "post",
                        where: {
                            userId: user.id
                        }
                    }]
                })
                var replays = await db.Replay.count({
                    where: {
                        userId: {
                            [Op.not]: user.id
                        },
                        ...filter.where

                    },
                    include: [{
                        model: db.Comment,
                        as: "comment",
                        where: {
                            userId: user.id
                        }
                    }]
                })

                var storyComments = await db.StoryComment.count({
                    where: {
                        userId: {
                            [Op.not]: user.id
                        },
                        ...filter.where
                    },
                    include: [{
                        model: db.Story,
                        as: "story",
                        where: {
                            userId: user.id
                        }
                    }]
                });
                notificaitonsState.unseenCommentNotification = comments + replays + storyComments;
                return notificaitonsState;
            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    },

    Mutation: {
        seeLikeNotifications: async (_, { }, { db, user }) => {

            try {

                var notificationState = await user.getNotificationsState();

                if (!notificationState)
                    throw new Error("Notifications State not found !");

                notificationState = await notificationState.update({
                    sawLikeNotificationAt: new Date().toISOString()
                })

                return notificationState
            } catch (error) {
                return new ApolloError(error.message);
            }
        },
        seeFollowNotifications: async (_, { }, { db, user }) => {
            
            try {

                var notificationState = await user.getNotificationsState();

                if (!notificationState)
                    throw new Error("Notifications State not found !");

                notificationState = await notificationState.update({
                    sawFollowNotificationAt: new Date().toISOString()
                })

                return notificationState
            } catch (error) {
                return new ApolloError(error.message);
            }

        },
        seeCommentNotifications: async (_, { }, { db, user }) => {

            try {

                var notificationState = await user.getNotificationsState();

                if (!notificationState)
                    throw new Error("Notifications State not found !");

                notificationState = await notificationState.update({
                    sawCommentNotificationAt: new Date().toISOString()
                })

                return notificationState
            } catch (error) {
                return new ApolloError(error.message);
            }
        },
        seeServiceNotifications: async (_, { }, { db, user }) => { },
    }
}