import { gql } from "apollo-server-express";


export default gql`

    extend type Mutation { 
        createPost(postInput : PostInput!) : Post @userAuth 
        deletePost(postId : ID!) : ID!  @userAuth   
        like ( postId : ID! ) : Boolean! @userAuth
        favorite ( postId : ID! ) : Boolean! @userAuth
        
    }
    input PostInput { 
        title : String  
        type : String! 
        media : [Upload!]
    }
    type Post  { 
        id : ID! 
        title : String  
        type  : String! 
        media : [Media!]  
        createdAt : String!
        updatedAt : String!
    }
    

`