import express from "express";
import { PORT, UPLOAD_COMMENTS_RECORDS_DIR, ASSETS, UPLOAD_MESSAGE_IMAGES_DIR, UPLOAD_MESSAGE_RECORDS_DIR, UPLOAD_MESSAGE_VIDEOS_DIR, UPLOAD_PICTURES_DIR, UPLOAD_POST_IMAGES_DIR, UPLOAD_POST_THUMBNAILS_DIR, UPLOAD_POST_VIDEOS_DIR, UPLOAD_REPLAYS_RECORDS_DIR, UPLOAD_STORIES_DIR } from "./config";
import {  ApolloServer } from "apollo-server-express";
import { Server } from "http";
import { typeDefs, resolvers, directives } from "./graphql";
import { userAuth } from "./middlewares";
import { graphqlUploadExpress } from "graphql-upload";
import { makeExecutableSchema } from '@graphql-tools/schema'
import db from "../models";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { SubscriptionUserAuth } from "./middlewares/userAuth";
import { PubSub } from "graphql-subscriptions";
import { handleStoriesExpirations } from "./providers";
import { sendPushNotification } from "./providers/pushNotification";
import { handleRemoveRequests } from "./providers/user";
// initialize our express server 
// init the Server 
const app = express();
const http = Server(app);

// aplaying middlewares
app.use(userAuth);
app.use(graphqlUploadExpress());



 



const pubSub = new PubSub();

app.use("/" + UPLOAD_PICTURES_DIR, express.static(UPLOAD_PICTURES_DIR));
app.use("/" + UPLOAD_POST_IMAGES_DIR, express.static(UPLOAD_POST_IMAGES_DIR));
app.use("/" + UPLOAD_POST_VIDEOS_DIR, express.static(UPLOAD_POST_VIDEOS_DIR));
app.use("/" + UPLOAD_POST_THUMBNAILS_DIR, express.static(UPLOAD_POST_THUMBNAILS_DIR));
app.use("/" + UPLOAD_COMMENTS_RECORDS_DIR, express.static(UPLOAD_COMMENTS_RECORDS_DIR));
app.use("/" + UPLOAD_REPLAYS_RECORDS_DIR, express.static(UPLOAD_REPLAYS_RECORDS_DIR));

app.use("/" + UPLOAD_MESSAGE_IMAGES_DIR, express.static(UPLOAD_MESSAGE_IMAGES_DIR));
app.use("/" + UPLOAD_MESSAGE_VIDEOS_DIR, express.static(UPLOAD_MESSAGE_VIDEOS_DIR));
app.use("/" + UPLOAD_MESSAGE_RECORDS_DIR, express.static(UPLOAD_MESSAGE_RECORDS_DIR));
app.use("/" + ASSETS, express.static(ASSETS))
app.use("/" + UPLOAD_STORIES_DIR, express.static(UPLOAD_STORIES_DIR));



var schema = makeExecutableSchema({ typeDefs, resolvers })
schema = directives.userAuthDirective()(schema);


async function startServer() {

    const subscriptionServer = SubscriptionServer.create({
        schema, execute, subscribe,
        onConnect: async (connectionParams, webSocket, context) => {
            const { user, isUserAuth } = await SubscriptionUserAuth(connectionParams);
            if (user)
                user.update({
                    isActive: true,
                }).then();
            return {
                db,
                user,
                isUserAuth,
                pubSub
            };
        },
        onDisconnect: async (_, context) => {
            const initPromise = await context.initPromise;
            const { user } = initPromise;
            if (user)
                user.update({
                    isActive: false,
                    lastActiveAt: new Date()
                }).then();

        }
    }, {
        server: http, path: "/graphql",
    })


    const apolloServer = new ApolloServer({
        csrfPrevention: false,
        introspection: true,
        playground: true,
        schema,
        context: ({ req }) => {
            const { isUserAuth, user } = req;

            return {
                db,
                isUserAuth,
                user,
                pubSub,
                sendPushNotification

            }
        },

        plugins: [
            {
                async serverWillStart() {
                    return {
                        async drainServer() {
                            subscriptionServer.close();
                        }
                    }
                }
            }
        ]

    });
    await apolloServer.start();

    http.listen(PORT, async () => {
        try {
            // apply the apollo server as middleware 
            apolloServer.applyMiddleware({ app });
            // listen 

            handleStoriesExpirations(db);
            handleRemoveRequests(db) ; 
            console.log(`Server is runing on port ${PORT}`)
        } catch (error) {
            console.log("Error : ", error)
        }
    })



}

startServer();

