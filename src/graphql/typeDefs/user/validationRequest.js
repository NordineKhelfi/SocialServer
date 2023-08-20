import { gql } from "apollo-server-express";


export default gql`
    extend type Query { 
        getCurrentValidationRequest : ValidationRequest @userAuth 
    }

 
    extend type Mutation { 
        createValidationRequest(validationRequestInput : ValidationRequestInput!)  : ValidationRequest! @userAuth
        deleteValidationRequest : ValidationRequest! @userAuth
        changeValidationRequestStatus ( id : ID! , status : String! ) : ValidationRequest! 
    }

    

    type ValidationRequest { 
        id : ID! , 
        name : String! 
        lastname : String!
        userId : ID!
        user : User!
        fileType  : String!
        mediaId : ID! 
        media : Media!
        countryId : ID! 
        categoryId : ID!
        category : Category! 
        country : Country!
         
        linkOne : String!
        linkTwo : String
        username : String! 
        status : String! 
        note : String 

    }


    input ValidationRequestInput { 
        name : String! 
        lastname : String!
        fileType  : String!
        media: Upload!
        countryId : ID! 
        categoryId : ID!
        linkOne : String!
        linkTwo : String  
        username : String!   
    }


`