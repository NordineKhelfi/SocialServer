import { gql } from "apollo-server-express";

export default gql`


    extend type Query { 
        getReels(time : String  , limit : Int!) : [Post!]! 
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


`