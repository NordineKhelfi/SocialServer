import { gql } from "apollo-server-express";


export default gql`

    type Media { 
        id : ID!  
        path : String!
    }

`