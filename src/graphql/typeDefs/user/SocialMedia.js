import { gql } from "apollo-server-express";


export default gql`


    type SocialMedia {
        facebook: String 
        twitter: String 
        snapshot: String 
        instagram: String 
    }

    input SocialMediaInput   { 
        facebook: String 
        twitter: String 
        snapshot: String 
        instagram: String 
    }

`