import { gql } from "apollo-server-express";

export default gql`
    input ServiceInput { 
        period : Int!  ,
        price : Int! 
        categoryId : ID!
        keywords : [String!]
    }


    type Service {
        id : ID! 
        period : Int!  
        price : Int!   
        categoryId : ID!
        category : Category!
        postId : ID!  

    }
`