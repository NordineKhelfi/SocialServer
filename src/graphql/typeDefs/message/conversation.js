import { gql } from "apollo-server-express";


export default gql`
    extend type Query { 
        getConversations(offset : Int! , limit : Int!) : [Conversation!]! @userAuth 
        getConversation(userId : ID! , type  : String) :  Conversation @userAuth 

    } 
    extend type Mutation { 
        createConversation ( members : [ID!]! ) : Conversation! @userAuth 
        createGroup ( members : [ID!]! ) : Conversation! @userAuth
        seeConversation(conversationId : ID!) :  String! @userAuth 
    } 

    extend type Subscription {
        conversationSaw : ConversationMember! @userAuth 
    }

    type Conversation { 
        id : ID! 
        type : String! 
        members : [ConversationMember!]!
        messages : [Message!]! 
        unseenMessages : Int 
    } 

    type ConversationMember {
        id : ID! 
        conversationId : ID! 
        userId: ID! 
        user : User! 
        lastSeenAt : String 
        conversation : Conversation 
       
    }
`