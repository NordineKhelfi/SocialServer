import { gql } from "apollo-server-express";

export default gql`

    extend type Query {
        searchHashTag(name : String!) : [HashTag!]! @userAuth  
    } 

    extend type Mutation {
        createHashTag(name : String!) : HashTag @userAuth
    }


    type HashTag  { 
        id :ID! 
        name : String!
    }

`