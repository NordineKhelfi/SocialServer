import express from "express";
import { PORT } from "./config";
import { ApolloServer } from "apollo-server-express";
import { Server } from "http";
import { typeDefs, resolvers, directives } from "./graphql";
import { userAuth } from "./middlewares";
import { graphqlUploadExpress} from "graphql-upload" ; 
import { makeExecutableSchema } from '@graphql-tools/schema'

import db from "../models";

// initialize our express server 
// init the Server 
const app = express();
const http = Server(app);

// aplaying middlewares
app.use(userAuth);
app.use(graphqlUploadExpress());


var schema = makeExecutableSchema({ typeDefs, resolvers })
schema = directives.userAuthDirective()(schema);


async function startServer() {

    const apolloServer = new ApolloServer({
        csrfPrevention: false,
        schema,
        context: ({ req }) => {
            const { isUserAuth, user } = req;
        
            return {
                db , 
                isUserAuth , 
                user 
            }
        }
    });

    await apolloServer.start();


    http.listen(PORT, async () => {
        try {
            // apply the apollo server as middleware 
            apolloServer.applyMiddleware({ app });
            // listen 


            console.log(`Server is runing on port ${PORT}`)
        } catch (error) {
            console.log("Error : ", error)
        }
    })

}

startServer();

