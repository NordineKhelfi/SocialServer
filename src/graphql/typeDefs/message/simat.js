import { gql } from "apollo-server-express";

export default gql`
    extend type Query {
        getSimats : [Simat!]! @userAuth 
    }

    extend type Subscription { 
        simatChanged (conversationId : ID!): Simat @userAuth 
    }

    extend type Mutation { 
        applySimat (conversationId : ID! , simatId : ID) : Conversation @userAuth
    }
    type Simat {
        id : ID! 
        path : String! 
    }
`