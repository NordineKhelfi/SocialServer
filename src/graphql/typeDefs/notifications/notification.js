import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        getFollowersNotifications(offset : Int! , limit : Int!) : [FollowNotification!]! @userAuth 
        getLikePostNotification(offset  : Int!, limit : Int!) : [LikePostNotification]! @userAuth 
        getStoryCommentNotification(offset : Int! , limit : Int!) : [StoryCommentNotification!]! @userAuth 
        getCommentPostNotification(offset  : Int! , limit : Int!) : [CommentPostNotification] @userAuth 
        getReplayCommentNotification(offset  : Int! , limit : Int!) : [ReplayCommentNotification] @userAuth 
        
    }

    extend type Subscription  {
        newFollow : Follow!  
        newLike : Like! 
        newComment : Comment! 
        newReplay : Replay! 
        newStoryComment : StoryComment! 

    }

    type FollowNotification {
        follow : Follow! 
    }  

    type LikePostNotification {
        like : Like! 
    }   

    type StoryCommentNotification {
        storyComment : StoryComment! 
    }
    
    type CommentPostNotification {
        
        comment : Comment! 
    } 

    type ReplayCommentNotification {
        
        
        replay : Replay! 
        
    }

`