import { ApolloError } from "apollo-server-express"
import { Op } from "sequelize";


const regexExp = /^#[A-Za-z0-9(_)]*$/;

const isValidHashTag = (name) => {
    return name.length > 1 && regexExp.test(name);
}


export default {
    Query: {
        searchHashTag: async (_, { name , offset, limit }, { db, user }) => {
            try {   
                name = name.trim() ; 

                var hashtags = await db.HashTag.findAll({
                    where : { 
                        name : {
                            [Op.like] : `%${name}%`
                        }
                    } , 
                    offset : offset , 
                    limit : limit 
                })  

                for (let index = 0 ; index < hashtags.length ; index ++) {
                    hashtags[index].numPosts = await hashtags[index].countPosts() ;  
                }

                return hashtags ; 
            
            } catch (error) {
                return new ApolloError(error.message);
            }
        }
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
                /*
                return await db.HashTag.findOrCreate({
                    where : { 
                        name : {
                            [Op.like] : name
                        }
                    }
                }) ; 
                */
                return hashtag;

            } catch (error) {
                return new ApolloError(error.message)
            }
        }
    }
}