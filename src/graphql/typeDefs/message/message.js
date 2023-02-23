import { gql } from "apollo-server-express";


export default gql`

    extend type Mutation { 
        sendMessage( messageInput : MessageInput!) : Message! @userAuth 
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
    } 

    input MessageInput { 
        type : String! 
        content : String 
        media : Upload 
        conversationId : ID!   
    }
    


`