import { gql } from "apollo-server-express";


export default gql`

    extend type Query { 
        getPostComments (postId : ID!) : [Comment!]! @userAuth
    }

    extend type Mutation { 
        comment(commentInput : CommentInput!) :  Comment! @userAuth 
        likeComment (commentId : ID!) : Boolean! @userAuth 
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
        replays : [Replay!]! 
        numReplays : Int!
        createdAt : String! 
        updatedAt : String!
    }

`