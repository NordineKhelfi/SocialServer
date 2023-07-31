import { gql } from "apollo-server-express";


export default gql`

    extend type Query { 
        getCommentReplays (commentId : ID! , offset : Int! , limit : Int!) : [Replay!]! @userAuth
        getReplayById(replayId : ID!) : Replay @userAuth 
    }

    extend type Mutation { 
        replay(replayInput : ReplayInput!) :  Replay! @userAuth 
        likeReplay (replayId : ID!) : Boolean! @userAuth 
        deleteReplay(replayId : ID!) : Replay! @userAuth
  
    }


    input ReplayInput { 
        commentId : ID! 
        media : Upload 
        replay : String  
    } 


    type Replay { 
        id : ID! 
        replay : String 
        mediaId : ID 
        media : Media 
        commentId : ID! 
        comment : Comment!
        userId : ID!
        user : User!
        liked : Boolean 
        createdAt : String! 
    }

`