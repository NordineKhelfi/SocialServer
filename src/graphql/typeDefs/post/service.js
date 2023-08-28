import { gql } from "apollo-server-express";

export default gql`
    input ServiceInput { 
        period : Int!  ,
        price : Float! 
        categoryId : ID!
        keywords : [String!]
        description : String 
    }


    type Service {
        id : ID! 
        period : Int!  
        price : Float!   
        categoryId : ID!
        category : Category!
        postId : ID!  
        description : String

    }


    
`