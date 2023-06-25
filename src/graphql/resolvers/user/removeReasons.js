import { ApolloError } from "apollo-server-express"

export default {
    Query: {
        getRemoveReasons: async (_, { }, { db, user }) => {
            try {
                return await db.RemoveReason.findAll() ; 
            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }
}