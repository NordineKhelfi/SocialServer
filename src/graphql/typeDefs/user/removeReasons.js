import { gql } from "apollo-server-express";

export default gql`

    extend type Query { 
        getRemoveReasons : [RemoveReason!] @userAuth 
    } 
    
    type RemoveReason { 
        id : ID! 
        reason : String!
    }

`