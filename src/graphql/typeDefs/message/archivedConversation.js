import { gql } from "apollo-server-express";

export default gql`


    extend type Query {

        getArchivedConversations(offset : Int! , limit : Int!) : [Conversation!]! @userAuth 
    } 

    extend type Mutation {
        archiveConversation(conversationId : ID!) :  ArchivedConversation! @userAuth 
        unArchiveConversation(conversationId : ID!) :  ArchivedConversation! @userAuth 
        
    }
     



    type ArchivedConversation { 
        id : ID! 
        conversationId : ID! 
        userId : ID! 
        createdAt : String! 
        conversation : Conversation! 
        user : User! 
    }



`