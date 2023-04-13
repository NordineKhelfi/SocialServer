import { gql } from "apollo-server-express";

export default gql`

    type Like {
        id : ID! 
        userId : ID! 
        postId: ID! 
        createdAt : String!
        post : Post! 
        user : User! 
    }

`