import { gql } from "apollo-server-express";


export default gql `

    extend type Query { 
        getBlockedUsers(offset : Int! , limit : Int!) : [User!]! @userAuth 
    } 

    extend type Mutation { 
        toggleBlock (userId : ID!) : Boolean! @userAuth     
    }

`