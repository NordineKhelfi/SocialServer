import { gql } from "apollo-server-express";


export default gql`

    extend type Query { 
        getCountries : [Country!]! 
    } 

    type  Country   { 
        id : ID! , 
        name : String!
        dialCode : String! 
    }

`