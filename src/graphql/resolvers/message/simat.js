import { ApolloError } from "apollo-server-express";
import { withFilter } from "graphql-subscriptions";

export default {


    Query: {
        getSimats: async (_, { }, { db, user }) => {
            return await db.Simat.findAll();
        }
    },


    Mutation: {

        applySimat: async (_, { conversationId, simatId }, { db, user, pubSub }) => {
            try {
                const userMember = await db.ConversationMember.findOne({
                    where: {
                        userId: user.id,
                        conversationId: conversationId
                    },
                    include: [{
                        model: db.Conversation,
                        as: "conversation",
                    }]
                });

                if (!userMember)
                    throw new Error("Conversation not found or you are not member of it");


                if (simatId) {
                    const simat = await db.Simat.findByPk(simatId);
                    if (!simat)
                        throw new Error("Simat not found");


                    var conversation = userMember.conversation;
                    await conversation.update({
                        simatId: simat.id
                    });
                    conversation.simat = simat;

                    pubSub.publish("SIMAT_CHANGED", {
                        simatChanged: simat,
                        conversation
                    });

                    return conversation;
                } else {
                    var conversation = userMember.conversation;
                    await conversation.update({
                        simatId: null,

                    });
                    pubSub.publish("SIMAT_CHANGED", {
                        simatChanged: null,
                        conversation
                    });
                    return conversation;
                }
            } catch (error) {
                return new ApolloError(error.message);
            }

        }
    },


    Subscription: {
        simatChanged: {
            subscribe: withFilter(
                (_, { }, { pubSub }) => pubSub.asyncIterator(`SIMAT_CHANGED`),


                ({ simatChanged, conversation }, { conversationId }, { isUserAuth, user }) => {
                    console.log(conversationId);

                    if (!isUserAuth)
                        return false;

                    return conversation.id == conversationId;

                })

        }
    }
}