import { gql } from "apollo-server-express";


export default gql`

    extend type Query { 
        getFollowers(offset : Int! , limit : Int!) : [Follow!]! @userAuth 
        getFollowing(offset : Int! , limit : Int!) : [Follow!]! @userAuth
    } 

    extend type Mutation { 
        toggleFollow(userId: ID!) : Boolean! @userAuth     
    }


    type Follow {
        userId : ID! 
        followingId : ID!  
        user : User! 
        following : User! 
        createdAt : String! 
    }

`