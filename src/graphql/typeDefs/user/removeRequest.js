import { gql } from "apollo-server-express";

export default gql`

    extend type Mutation {
        removeAccount(removeRequest :RemoveRequestInput! , password : String!) : RemoveRequest  @userAuth 
        activateAccount : Boolean @userAuth 
    
    } 




    type RemoveRequest { 
        id : ID!  
        reasonId : ID!  
        reason : String 
        userId : ID! 
        user : User! 
        removeReason : RemoveReason!
    }

    input RemoveRequestInput { 
        reasonId : ID!
        reason : String   
    }

`