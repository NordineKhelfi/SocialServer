import { gql } from "apollo-server-express";


export default gql`
    extend type Query { 
        getConversations(offset : Int! , limit : Int!) : [Conversation!]! @userAuth 
        getConversation(userId : ID! , type  : String) :  Conversation @userAuth 

    } 
    extend type Mutation { 
        createConversation ( members : [ID!]! ) : Conversation! @userAuth 
        createGroup ( members : [ID!]! ) : Conversation! @userAuth
    } 

    type Conversation { 
        id : ID! 
        type : String! 
        members : [User!]!
        messages : [Message!]!
    } 
`