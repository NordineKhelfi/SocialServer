import { gql } from "apollo-server-express";


export default gql`

    extend type Query { 
        getMessages(conversationId : ID!  , offset : Int! , limit : Int!) : [Message!]! @userAuth 
    
    }
    extend type Mutation { 
        sendMessage( messageInput : MessageInput!) : Message!   @userAuth 
        sharePost(postId : ID! , conversationId : ID!) : Message! @userAuth 
        shareAccount(userId : ID! , conversationId : ID!): Message @userAuth
    }

    extend type Subscription  {
        newMessage : Message 
    }
    type Message { 
        id : ID! 
        type : String!
        content : String 
        sender : User! 
        conversationId : ID! 
        mediaId : ID! 
        media : Media  
        conversation : Conversation! 
        createdAt : String!
        post : Post 
        postId : ID 
        account : User
    } 

    input MessageInput { 
        type : String! 
        content : String 
        media : Upload
        conversationId : ID!   
    }
    


`