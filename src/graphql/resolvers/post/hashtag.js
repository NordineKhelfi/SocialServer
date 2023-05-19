import { ApolloError } from "apollo-server-express"
import { Op } from "sequelize";


const regexExp = /#+([ا-يa-zA-Z0-9_]+)/;

export const isValidHashTag = (name) => {
    return name.length > 1 && regexExp.test(name);
}


export default {
    Query: {
        searchHashTag: async (_, { name, offset, limit }, { db, user }) => {
            try {
                name = name.trim();

                var hashtags = await db.HashTag.findAll({
                    where: {
                        name: {
                            [Op.like]: `%${name}%`
                        }
                    },
                    offset: offset,
                    limit: limit
                })

                for (let index = 0; index < hashtags.length; index++) {
                    hashtags[index].numPosts = await hashtags[index].countPosts();
                }

                return hashtags;

            } catch (error) {
                return new ApolloError(error.message);
            }
        },


        getHashTagByName: async (_, { name }, { db , user  }) => {


            try {

                if (!isValidHashTag(name)) 
                    throw new Error("Not Valida Hashtag name ")  ;
                var hashtag = await db.HashTag.findOne({
                    where: {
                        name: name
                    }
                });

                if (!hashtag)
                    return null;


                hashtag.numPosts = await hashtag.countPosts();
                return hashtag ; 
            } catch (error) {
                return new ApolloError(error.message) ; 

            }
        },


        getHashTagPosts: async (_, { name , offset , limit}, { db, user }) => {
            try { 

                if ( !isValidHashTag (name)) { 
                    throw new Error("Not Valid Hashtag name !") ; 
                }
                const hashtag = await  db.HashTag.findOne({
                    where : {
                        name : name 
                    }
                }) ; 


                var posts = await hashtag.getPosts({
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
                        include : [{
                            model : db.Media , 
                            as  :"thumbnail"
                        }]
                    }],
                  
                    order: [["createdAt", "DESC"]],

                    offset : offset , 
                    limit : limit 
                })
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

                return posts ; 


            }catch(error) {
                return new ApolloError(error.message) ; 
            }
        },
    },
    Mutation: {
        createHashTag: async (_, { name }, { db, user }) => {
            try {
                if (!isValidHashTag(name)) {
                    throw new Error("Not valid hashtag")
                }


                const hashtag = await db.HashTag.findOne({
                    where: {
                        name: {
                            [Op.like]: name

                        }
                    }
                });

                if (!hashtag)
                    return await db.HashTag.create({ name: name })

                return hashtag;

            } catch (error) {
                return new ApolloError(error.message)
            }
        }
    }
}