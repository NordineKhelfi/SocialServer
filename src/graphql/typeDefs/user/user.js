import { gql } from "apollo-server-express";


export default gql`

    extend type Query {
        Login (identifier : String ! , password : String!) : UserToken! 
        getUserById(userId : ID!) : User 
        checkUsername(username : String!) : Boolean! 
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
        profilePicture : Upload 
        pictureId : ID 
        
        bio : String 
        socialMedia : SocialMediaInput 
    }

    type User { 
        id : ID! 
        name : String! 
        lastname : String! 
        email : String! 
        profilePicture : Media 
        pictureId : ID 
        isFollowed : Boolean 

        username : String! 
        password : String! 
        confirmPassword : String! 
        birthday : String! 
        gender : Boolean! 
        countryId : ID! 
        phone : String 
        country : Country!
        stories : [Story!] 
        bio : String 
        private : Boolean! 
        disabled : Boolean!
        numFollowers : Int! 
        numPosts : Int! 
        numFollowing : Int! 
        numVisits : Int! 
        validated : Boolean! 
        socialMedia : SocialMedia 
    }


    type UserToken { 
        user : User! 
        token : String! 
    }

` 


