import { gql } from "apollo-server-express";


export default gql`

    extend type Mutation { 
        createPost(postInput : PostInput!) : Post @userAuth 
        deletePost(postId : ID!) : ID!  @userAuth
    }


    input PostInput { 
        title : String  
        type : String! 
        media : [Upload!]
    }


    type Post  { 

        title : String  
        type  : String! 
        media : [Media!]  
    }
    

`