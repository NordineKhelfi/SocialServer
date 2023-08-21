import { gql } from "apollo-server-express";

export default gql`


    extend type Query {
        getKeywords (name : String!) : [Keyword!]! @userAuth 
    }

    type Keyword {
        id : ID! 
        name : String! 
    }


`