import { gql } from "apollo-server-express";


export default gql`

    

    extend type Mutation { 
        comment(commentInput : CommentInput!) :  Comment! @userAuth 
    
    }


    input CommentInput { 
        postId : ID! 
        media : Upload 
        comment : String  
    } 


    type Comment { 
        id : ID! 
        comment : String 
        mediaId : ID 
        media : Media 
        postId : ID! 
        post : Post!
        userId : ID!
        user : User!
        createdAt : String! 
        updatedAt : String!
    }

`