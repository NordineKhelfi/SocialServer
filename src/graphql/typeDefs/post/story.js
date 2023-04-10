import { gql } from "apollo-server-express";


export default gql`

    extend type Query { 
        getStories (offset : Int! , limit : Int!) : [Follow!]! @userAuth 
        getUserStories ( userId : ID!) : [Story!]! @userAuth 
    }
    extend type Mutation { 
        createStory(storyInput : StoryInput!) : Story! @userAuth 
        toggleLikeStory(storyId : ID!) : Boolean! @userAuth  
        commentStory (storyCommentInput : StoryCommentInput!) : StoryComment! @userAuth
        seeStory(storyId : ID!) : Boolean @userAuth   
    }


    type Story { 
        id : ID! 
        media : Media! 
        user : User! 
        liked : Boolean!
        seen : Boolean 
        createdAt : String!
        expiredAt : String! 
        updatedAt : String!
    } 

    input StoryInput { 
        media : Upload! 
    }

    input StoryCommentInput { 
        comment : String! 
        storyId : ID! 
    } 

    type StoryComment { 
        id : ID! 
        comment : String! 
        storyId : ID! 
    }

`