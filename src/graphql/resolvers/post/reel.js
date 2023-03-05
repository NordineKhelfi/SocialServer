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
                        model : db.Reel , 
                        as : "reel" , 
                        include : [ 
                            { 
                                model : db.Media , 
                                as : "thumbnail"
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
                                id: posts[index].id
                            }
                        })).length > 0;
                    }
                }

                return posts;
                return [];

            } catch (error) {
                return new ApolloError(error.message)
            }
        }
    }
}