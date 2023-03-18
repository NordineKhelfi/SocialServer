import express from "express";
import { PORT, UPLOAD_COMMENTS_RECORDS_DIR, UPLOAD_PICTURES_DIR, UPLOAD_POST_IMAGES_DIR, UPLOAD_POST_THUMBNAILS_DIR, UPLOAD_POST_VIDEOS_DIR, UPLOAD_REPLAYS_RECORDS_DIR } from "./config";
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


app.use("/" + UPLOAD_PICTURES_DIR, express.static(UPLOAD_PICTURES_DIR));
app.use("/" + UPLOAD_POST_IMAGES_DIR, express.static(UPLOAD_POST_IMAGES_DIR));
app.use("/" + UPLOAD_POST_VIDEOS_DIR, express.static(UPLOAD_POST_VIDEOS_DIR));
app.use("/" + UPLOAD_POST_THUMBNAILS_DIR , express.static(UPLOAD_POST_THUMBNAILS_DIR));
app.use("/" + UPLOAD_COMMENTS_RECORDS_DIR , express.static(UPLOAD_COMMENTS_RECORDS_DIR));
app.use("/" + UPLOAD_REPLAYS_RECORDS_DIR , express.static(UPLOAD_REPLAYS_RECORDS_DIR));



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

