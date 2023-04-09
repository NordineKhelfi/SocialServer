import { gql } from "apollo-server-express";


export default gql`

    extend type Query { 
        getFollowers(offset : Int! , limit : Int!) : [User!]! @userAuth 
        getFollowing(offset : Int! , limit : Int!) : [User!]! @userAuth
    } 

    extend type Mutation { 
        toggleFollow(userId: ID!) : Boolean! @userAuth     
    }


    type Follow {
        user : User! 
        following : User! 
        createdAt : String! 
    }

`