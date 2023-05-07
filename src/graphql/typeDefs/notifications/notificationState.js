import { gql } from "apollo-server-express";

export default gql`

    extend type Query { 
        getNotificationState : NotificationState! @userAuth  
    }  


    extend type Mutation { 
        seeLikeNotifications : NotificationState! @userAuth
        seeFollowNotifications : NotificationState! @userAuth 
        seeCommentNotifications : NotificationState! @userAuth
        seeServiceNotifications : NotificationState! @userAuth
    }




    type NotificationState { 
        id : ID!     
        userId : ID! 
        user : User!
        sawFollowNotificationAt : String  
        sawLikeNotificationAt: String  
        sawCommentNotificationAt: String  
        sawServiceNotificationAt: String  

        unseenFollowNotification : Int
        unseenLikeNotification : Int
        unseenCommentNotification : Int 
        unseenServiceNotification : Int 
    }


`