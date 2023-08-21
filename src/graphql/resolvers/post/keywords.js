import { ApolloError } from "apollo-server-express"
import { Op } from "sequelize";

export default {
    Query : {
        getKeywords : async ( _ , { name } , {db , user}) => {
            try {
                name = name.split(" ").filter(word => word != " ").join(" ") ; 

                return await db.Keyword.findAll({
                    where : {
                        name : { [Op.like] : `%${name}%` }
                    }
                })
            }catch(error)  {
                return new ApolloError(error.message) ; 
            }
        }
    }
}