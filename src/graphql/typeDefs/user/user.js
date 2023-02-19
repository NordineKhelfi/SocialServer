import { gql } from "apollo-server-express";


export default gql`

    extend type Query {
        Login (identifier : String ! , password : String!) : UserToken! 
        getUserById(userId : ID!) : User 
    }

    extend type Mutation { 
        SignUp ( user : UserInput ) : UserToken!  
        EditProfile  (userInput : EditUserInput) : User @userAuth
        toggleDisable : User! @userAuth 
        togglePrivate : User! @userAuth 
        deleteAccount : ID! @userAuth 
    } 


    input UserInput { 
        name : String! 
        lastname : String! 
        email : String! 
        username : String! 
        password : String! 
        confirmPassword : String! 
        birthday : String! 
        gender : Boolean! 
        countryId : ID! , 
        phone : String 
    }

    input EditUserInput { 

        name : String! 
        lastname : String! 
        username : String! 
        countryId : ID! , 
        bio : String 
        socialMedia : SocialMediaInput 
    }

    type User { 
        id : ID! 
        name : String! 
        lastname : String! 
        email : String! 
        username : String! 
        password : String! 
        confirmPassword : String! 
        birthday : String! 
        gender : Boolean! 
        countryId : ID! 
        phone : String 
        country : Country!
        
        bio : String 
        private : Boolean! 
        disabled : Boolean!
        
        socialMedia : SocialMedia 
    }


    type UserToken { 
        user : User! 
        token : String! 
    }

` 


