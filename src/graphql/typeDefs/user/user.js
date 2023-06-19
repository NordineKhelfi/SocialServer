import { gql } from "apollo-server-express";


export default gql`

    extend type Query {
        Login (identifier : String ! , password : String!) : UserToken! 
        getUserById(userId : ID!) : User 
        checkUsername(username : String!) : Boolean! 
        suggestUsers( offset : Int! , limit : Int!) : [User!]! @userAuth
        searchUser(query : String! , offset : Int! , limit : Int!) : [User!]! @userAuth 


    }

    extend type Mutation { 
        SignUp ( user : UserInput ) : UserToken!  
        EditProfile  (userInput : EditUserInput) : User @userAuth
        disableAccount(password : String!) : User! @userAuth 
        togglePrivate : User! @userAuth 
        updateToken(token : String!) : String! @userAuth 
        logOut : User! @userAuth 

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
        followers : [Follow!]
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
        lastActiveAt : String 
        isActive : Boolean 
        socialMedia : SocialMedia  
        updatedAt : String! 
        createdAt : String! 
    }
    type UserToken { 
        user : User! 
        token : String! 
    }

` 


