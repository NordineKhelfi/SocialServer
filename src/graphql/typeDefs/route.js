import { gql } from "apollo-server-express";


// the main route query every Graphql type will extends this type 
export default gql`
    directive @userAuth on FIELD_DEFINITION
    scalar Upload
    
    type Query {
        _ : String!    
    }  

    type Subscription { 
        _ : String! 
    }
    type Mutation {
        _ : String!
    }
 
`