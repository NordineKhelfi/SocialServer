import { gql } from "apollo-server-express";


export default gql`

    extend type Query { 
        getUserPosts ( userId : ID!, postType : String! , offset : Int! , limit : Int!) : [Post!]! @userAuth 
    } 

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
        reel : ReelInput 
    }
    type Post  { 
        id : ID! 
        title : String  
        type  : String! 
        media : [Media!]  
        user : User!
        likes : Int! 
        liked : Boolean! 
        reel : Reel 
        createdAt : String!
        updatedAt : String!
    }
    

`