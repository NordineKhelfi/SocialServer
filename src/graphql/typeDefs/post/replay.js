import { gql } from "apollo-server-express";


export default gql`

    

    extend type Mutation { 
        replay(replayInput : ReplayInput!) :  Replay! @userAuth 
        likeReplay (replayId : ID!) : Boolean! @userAuth 
  
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
    }

`