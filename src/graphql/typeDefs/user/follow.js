import { gql } from "apollo-server-express";


export default gql`

    extend type Query { 
        getFollowers(query : String ,  offset : Int! , limit : Int!) : [User!]! @userAuth 
        getFollowing(query : String , offset : Int! , limit : Int!) : [User!]! @userAuth


    } 

    extend type Mutation { 
        toggleFollow(userId: ID!) : Boolean! @userAuth     
    }


    type Follow {
        id : ID! 
        userId : ID! 
        followingId : ID!  
        user : User! 
        following : User! 
        createdAt : String! 
    }

`