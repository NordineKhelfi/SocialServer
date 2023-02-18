import express from "express" ; 
import { PORT } from "./config";
import { ApolloServer } from "apollo-server-express";
import { Server } from "http";
import { typeDefs , resolvers } from "./graphql" ; 
import db from "../models" ; 



// initialize our express server 
// init the Server 
const app = express();
const http = Server(app);


async function startServer() {

    const apolloServer = new ApolloServer({
        csrfPrevention: false,
        typeDefs , 
        resolvers , 
        playground : true , 
        context : ({ req }) => { 
            return { 
                db 
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

