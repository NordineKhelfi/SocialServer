import { gql } from "apollo-server-express";

export default gql`

    extend type Query {
        searchHashTag(name : String! , offset : Int!, limit : Int!) : [HashTag!]! @userAuth  
        getHashTagByName(name : String!) : HashTag 
        getHashTagPosts(name : String! , offset :Int!, limit : Int!) : [Post!]! 
    } 



    extend type Mutation {
        createHashTag(name : String!) : HashTag @userAuth
        followHashTag(hashtagId : ID!) : Boolean! @userAuth 
    }
    
    type HashTag  { 
        id :ID! 
        name : String!
        numPosts : Int! 
        isFollowed : Boolean 
    }

    input HashTagInput { 
 
        name : String! 
    }

`