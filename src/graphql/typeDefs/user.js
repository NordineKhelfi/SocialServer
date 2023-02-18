import { gql } from "apollo-server-express";


export default gql`

    extend type Query {
        Login (identifier : String ! , password : String!) : String! 
    }

    extend type Mutation { 
        SignUp ( user : UserInput ) : String!  
    } 


    input UserInput { 
        name : String! 
        lastname : String! 
        email : String! 
        username : String! 
        password : String! 
        confirmPassword : String! 
    }

` 