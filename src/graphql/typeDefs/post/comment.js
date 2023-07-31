import { gql } from "apollo-server-express";


export default gql`

    extend type Query { 
        getPostComments (postId : ID! , offset : Int! , limit : Int!) : [Comment!]! @userAuth
        getCommentById(commentId : ID!) : Comment @userAuth 
    }

    extend type Mutation { 
        comment(commentInput : CommentInput!) :  Comment! @userAuth 
        likeComment (commentId : ID!) : Boolean! @userAuth 
        deleteComment(commentId : ID!) : Comment! @userAuth 
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
        liked : Boolean!
        replays : [Replay!]! 
        numReplays : Int!
        createdAt : String! 
        updatedAt : String!
    }

`