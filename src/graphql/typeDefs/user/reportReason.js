import { gql } from "apollo-server-express";

export default gql`

    extend type Query { 

        getReportReasons : [ReportReason!]! @userAuth  
    } 


    type ReportReason { 
        id : ID! 
        reason : String!
    }


`