import { ApolloError } from "apollo-server-express"

export default {

    Query: {

        getArchivedConversations: async (_, { offset , limit }, { db, user }) => {



            return [] ; 
        } , 


    },


    Mutation: {
        archiveConversation: async (_, { conversationId }, { db, user }) => {
            try { 

                

            }catch(error) { 
                return new ApolloError(error.message) ; 
            }
        } , 


        unArchiveConversation: async (_, { conversationId }, { db, user }) => {
            try { 

            }catch(error) { 
                return new ApolloError(error.message) ; 
            }
        } , 
    }
}