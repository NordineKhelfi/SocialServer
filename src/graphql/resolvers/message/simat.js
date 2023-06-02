import { ApolloError } from "apollo-server-express";

export default {


    Query: {
        getSimats: async (_, { }, { db, user }) => {
            return await db.Simat.findAll();
        }
    },


    Mutation: {


        applySimat: async (_, { conversationId, simatId }, { db, user }) => {
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

                const simat = await db.Simat.findByPk(simatId) ; 
                if (!simat) 
                    throw new Error("Simat not found") ; 
                

                var conversation = userMember.conversation;

                conversation.simat = simat ; 

                return conversation;

                return null;
            } catch (error) {
                return new ApolloError(error.message);
            }

        }
    }
}