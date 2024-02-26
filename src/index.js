import express from "express";
import { mailConfig, PORT, UPLOAD_COMMENTS_RECORDS_DIR, ASSETS, UPLOAD_MESSAGE_IMAGES_DIR, UPLOAD_MESSAGE_RECORDS_DIR, UPLOAD_MESSAGE_VIDEOS_DIR, UPLOAD_PICTURES_DIR, UPLOAD_POST_IMAGES_DIR, UPLOAD_POST_THUMBNAILS_DIR, UPLOAD_POST_VIDEOS_DIR, UPLOAD_REPLAYS_RECORDS_DIR, UPLOAD_STORIES_DIR, UPLOAD_POST_WORKS_DIR, UPLOAD_POST_SERVICES_DIR } from "./config";
import { ApolloServer } from "apollo-server-express";
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
import nodemailer from "nodemailer";
import { google } from "googleapis";

const oAuth = google.auth.OAuth2;
const oAuth_client = new oAuth(mailConfig.clientId, mailConfig.clientSecret, "https://dashing-incredibly-grouse.ngrok-free.app/auth/google/callback");
oAuth_client.setCredentials({ refresh_token: mailConfig.refreshToken })

const sendMail = async (email, content) => {

    if (!email || !content)
        return;

    const { token } = await oAuth_client.getAccessToken();

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            // type: "OAuth2",
            user: mailConfig.email,
            pass: "spqd zlvj mqmw khze"
            // clientId: mailConfig.clientId,
            // clientSecret: mailConfig.clientSecret,
            // refreshToken: mailConfig.refreshToken,
            // accessToken: token
        }
    });

    transporter.sendMail({
        from: mailConfig.email,
        to: email,
        ...content
    }, (error, result) => {
        console.log(error);
        console.log(result);
    })
}

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
app.use("/" + UPLOAD_POST_WORKS_DIR, express.static(UPLOAD_POST_WORKS_DIR));
app.use("/" + UPLOAD_POST_SERVICES_DIR, express.static(UPLOAD_POST_SERVICES_DIR));
app.use("/" + ASSETS, express.static(ASSETS))
app.use("/" + UPLOAD_STORIES_DIR, express.static(UPLOAD_STORIES_DIR));

app.get('/', (req, res) => {
    res.json({ message: 'Al-hamdulillah' });
});

app.get('/authorize', (req, res) => {
    const authUrl = oAuth_client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/gmail.send'],
    });

    console.log('Authorize this app by visiting this URL:', authUrl);
    res.json({ authUrl });
});

app.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;

    try {
        const { tokens } = await oAuth_client.getToken(code);
        const refreshToken = tokens.refresh_token;
        console.log(refreshToken);
        // Handle tokens as needed (e.g., store them securely)
        res.json(tokens);
    } catch (error) {
        console.error('Error exchanging code for tokens:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/sendmail', (req, res) => {
    sendMail('nordine.khelfi@gmail.com', {
        from: "Vinkst",
        to: 'nordine.khelfi@gmail.com',
        subject: "تأكيد الحساب",
        html: `
            <p>رقم تأكيد الحساب : <b>010101</b></p>
        `
    });

    res.json({ message: 'Sent!' });
});

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
                sendPushNotification,
                sendMail

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
            handleRemoveRequests(db);
            console.log(`Server is runing on port ${PORT}`)
        } catch (error) {
            console.log("Error : ", error)
        }
    })



}

startServer();

