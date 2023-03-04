import { gql } from "apollo-server-express";

export default gql`


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