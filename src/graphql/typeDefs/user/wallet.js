import { gql } from "apollo-server-express";

export default gql`



    extend type Query {
        getWallet : Wallet  @userAuth 
    }

    extend type Mutation {
        createWallet : Wallet! @userAuth 
        deposit(amount : Float!) : Wallet! @userAuth 
        withdraw(amount : Float!): Wallet! @userAuth
    }


    type Wallet {
        id : ID! 
        funds : Float! 
        user : User! 
        userId : ID!
    }




`