import { gql } from "apollo-server-express";

export default gql`

    extend type Mutation { 
        sendReport(reportInput : ReportInput!) : Report!  @userAuth  
    } 


    input ReportInput {
        reasonId : ID! 
        userId : ID
        postId : ID
        conversationId : ID
        details : String! 
    }

    type Report { 
        id : ID! 
        reporterId : ID! 
        reporter : User!
        reasonId : ID! 
        reason : ReportReason! 
        details : String! 
        userId : ID
        postId : ID
        conversationId : ID
        user : User 
        post : Post
        conversation : Conversation
        createdAt : String! 
    }
`