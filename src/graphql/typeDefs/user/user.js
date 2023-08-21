import { gql } from "apollo-server-express";


export default gql`

    extend type Query {
        Login (identifier : String ! , password : String!) : UserToken! 
        getUserById(userId : ID!) : User 
        checkUsername(username : String!) : Boolean! 
        suggestUsers( offset : Int! , limit : Int!) : [User!]! @userAuth
        searchUser(query : String! , offset : Int! , limit : Int!) : [User!]! @userAuth 
        oAuth ( email : String!) : UserToken!
        checkEmailExists( email : String!) : Boolean!  
    }

    extend type Mutation { 
        SignUp ( user : UserInput ) : UserToken!  
        EditProfile  (userInput : EditUserInput) : User @userAuth
        disableAccount(password : String!) : User! @userAuth 
        togglePrivate : User! @userAuth 
        updateToken(token : String!) : String! @userAuth 
        logOut : User! @userAuth 
        addPhoneNumber(phone : String! ,  password : String!) : User! @userAuth 
        changePassword(oldPassword : String! , newPassword : String!) : String! @userAuth 
        toggleMute : Boolean! @userAuth
        toggleShowState : Boolean! @userAuth
        toggleAllowMessaging : Boolean! @userAuth
        sendEmailConfirmation(email : String!) : Boolean! 
        confirmEmail (email: String! , otpCode  : String!): UserToken! 
        forgetPassword(otp : String! , newPassword : String!) : String! @userAuth
        activateProfessional  : User! @userAuth      
        pickCategory ( categoryId : ID!) : User! @userAuth 
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
        state : String
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
        state : String
        birthday : String! 
        gender : Boolean! 
        countryId : ID 
        phone : String 
        country : Country 
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
        allowMessaging : Boolean  
        mute : Boolean
        showState : Boolean 
        updatedAt : String! 
        createdAt : String! 
        isValid : Boolean! 
        categoryId : ID 
        professional : Boolean!        
    }
    type UserToken { 
        user : User! 
        token : String! 
    }

` 


