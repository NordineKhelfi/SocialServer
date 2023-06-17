import { ApolloError } from "apollo-server-express"
import { Op } from "sequelize";

export default {
    Query: {
        getReels: async (_, { time, limit }, { db, user }) => {
            try {
                if (!time)
                    time = new Date().toISOString();
                else
                    time = new Date(parseInt(time)).toISOString();



                var blockedUsers = await db.BlockedUser.findAll({
                    where: {
                        [Op.or]: [
                            {
                                blockedUserId: user.id
                            },
                            {
                                userId: user.id
                            }
                        ]
                    }
                });


                blockedUsers = blockedUsers.map(blockedUser => {
                    return (blockedUser.userId == user.id) ? (blockedUser.blockedUserId) : (blockedUser.userId)
                })




                var followings = await user.getFollowing();
                followings = followings.map(follow => follow.followingId);

                followings.push(user.id);
                var posts = await db.Post.findAll({
                    include: [{
                        model: db.User,
                        as: "user",
                        required: true,
                        where: {
                            id: { [Op.not]: blockedUsers },


                            [Op.or]: [
                                {
                                    id: {
                                        [Op.in]: followings
                                    }
                                },
                                {
                                    private: false
                                }
                            ]

                        },
                        include: [{
                            model: db.Media,
                            as: "profilePicture"
                        }]
                    }, {
                        model: db.Media,
                        as: "media"
                    }, {
                        model: db.Reel,
                        as: "reel",
                        include: [
                            {
                                model: db.Media,
                                as: "thumbnail"
                            }
                        ]
                    }],
                    where: {
                        type: "reel",
                        createdAt: {
                            [Op.lt]: time
                        }
                    },
                    order: [["createdAt", "DESC"]],
                    limit
                });

                // if the user logged in check if he allready liked on of this posts 
                if (user) {
                    for (let index = 0; index < posts.length; index++) {
                        posts[index].liked = (await user.getLikes({
                            where: {
                                postId: posts[index].id
                            }
                        })).length > 0;

                        posts[index].isFavorite = (await user.getFavorites({
                            where: {
                                postId: posts[index].id
                            }
                        })).length > 0;

                    }

                }
                else {
                    for (let index = 0; index < posts.length; index++) {
                        posts[index].liked = false;
                        posts[index].isFavorite = false;
                    }

                }

                return posts;


            } catch (error) {
                console.log(error);
                return new ApolloError(error.message)
            }
        },
        getFollowersReels: async (_, { time, limit }, { db, user }) => {
            try {

                var followings = await user.getFollowing();
                followings = followings.map(following => following.followingId);

                if (!time)
                    time = new Date().toISOString();
                else
                    time = new Date(parseInt(time)).toISOString();

                var posts = await db.Post.findAll({
                    include: [{
                        model: db.User,
                        as: "user",
                        include: [{
                            model: db.Media,
                            as: "profilePicture"
                        }]
                    }, {
                        model: db.Media,
                        as: "media"
                    }, {
                        model: db.Reel,
                        as: "reel",
                        include: [
                            {
                                model: db.Media,
                                as: "thumbnail"
                            }
                        ]
                    }],
                    where: {
                        type: "reel",
                        createdAt: {
                            [Op.lt]: time
                        },

                        userId: {
                            [Op.in]: followings
                        }

                    },
                    order: [["createdAt", "DESC"]],
                    limit
                });

                for (let index = 0; index < posts.length; index++) {
                    posts[index].liked = (await user.getLikes({
                        where: {
                            postId: posts[index].id
                        }
                    })).length > 0;

                    posts[index].isFavorite = (await user.getFavorites({
                        where: {
                            postId: posts[index].id
                        }
                    })).length > 0;
                }
                return posts;

            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    },

    Mutation: {
        seeReel: async (_, { reelId }, { db, user }) => {
            try {

                var reel = await db.Reel.findByPk(reelId);
                if (!reel) {
                    throw new Error("Reel not found");
                }

                reel = await reel.update({
                    views: reel.views + 1
                });

                return reel.views;

            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }
}