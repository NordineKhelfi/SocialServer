import { gql } from "apollo-server-express";

export default gql`


    extend type Query { 
        getReels(time : String  , limit : Int!) : [Post!]! 
        getFollowersReels(time : String  , limit : Int!) : [Post!]! @userAuth 
        
    }
    

    extend type Mutation { 
        seeReel( reelId : ID!) : Int! @userAuth 
    }


    type Reel { 
        id : ID! 
        thumbnail : Media! 
        postId : ID! 
        views : Int!
    } 

    input ReelInput { 
        thumbnail : Upload!
    }


    input EditReelInput { 
        thumbnail : EditMedia!
    }


`