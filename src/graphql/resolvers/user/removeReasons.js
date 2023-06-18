import { ApolloError } from "apollo-server-express"

export default {
    Query: {
        getRemoveReasons: async (_, { }, { db, user }) => {
            try {

                console.log( "executed") ; 
                return await db.RemoveReason.findAll() ; 

            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }
}