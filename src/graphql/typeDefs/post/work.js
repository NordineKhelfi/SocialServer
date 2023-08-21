import { gql } from "apollo-server-express";

export default gql`
    input WorkInput { 
        date : String ,
        description : String! 
        link : String 
        categoryId : ID!
        keywords : [String!]
    }


    type Work {
        id : ID! 
        date : String ,
        description : String! 
        link : String 
        categoryId : ID!
        category : Category!
        views : Int! 
        postId : ID!  

    }
`