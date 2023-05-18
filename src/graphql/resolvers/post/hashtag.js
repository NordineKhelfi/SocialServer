import { ApolloError } from "apollo-server-express"
import { Op } from "sequelize";


const regexExp = /^#[A-Za-z0-9(_)]*$/ ;

const isValidHashTag = (name) => { 
    return name.length > 1 &&  regexExp.test(name);
}


export default {
    Query : { 
        
    } , 
    Mutation : { 
        createHashTag : async ( _ , { name } , {db , user}) => {
            try { 
                if (!isValidHashTag(name)) {
                    throw new Error("Not valid hashtag")
                } 

                
                const hashtag =  await db.HashTag.findOne({
                    where : {
                        name : { 
                            [Op.like] : name
                            
                        }
                    }
                }); 

                if ( !hashtag ) 
                    return await db.HashTag.create({name : name})
                /*
                return await db.HashTag.findOrCreate({
                    where : { 
                        name : {
                            [Op.like] : name
                        }
                    }
                }) ; 
                */
                return hashtag ; 

            }catch(error) { 
                return new ApolloError(error.message)
            }
        } 
    }
}