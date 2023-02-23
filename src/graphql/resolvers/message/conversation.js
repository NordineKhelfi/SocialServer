import { ApolloError } from "apollo-server-express";

export default {

    Query: {
        getConversations: async (_, { offset, limit }, { db, user }) => {
            return [];
        }
    },

    Mutation: {
        createConversation: async (_, { members }, { db, user }) => {
            try {
                // get user memebers and validate their existens 
                if (members.length != 1)
                    throw new Error("Conversation member do not exists");

                const userMember = await db.User.findByPk(members[0]);
                if (userMember == null)
                    throw new Error("User do not exists");

                // create the conversation 
                const conversation = await db.Conversation.create({
                    type: "individual"
                });

                // add the creator of the conversation 
                // and add the target user to communicate with  
                await conversation.addMember(user);
                await conversation.addMember(userMember);

                conversation.members = [user, userMember];
                conversation.messages = [];
                return conversation

            } catch (error) {
                return new ApolloError(error.message);
            }
        },
        createGroup: async (_, { members }, { db, user }) => {
            try {
                // quick check in case members array is empty or contain one member  
                if (members.length <= 1)
                    throw Error("in group conversation their should be at least 2 members");

                // get user member and check if it's all of them real users
                // loop over them and get user from database by id 
                // if the user not found throw an error to break the thread 
                // else push it to the user table 
                var users = [];
                for (let index = 0; index < members.length; index++) {
                    var userMember = await db.User.findByPk(members[index]);
                    if (userMember == null)
                        throw new Error("User " + members[index] + " not found");
                    users.push(userMember);
                }
                // if we reach this level all members are real users in the system 
                // create the conversation as a grouup conversation  
                const conversation = await db.Conversation.create({
                    type: "group"
                });

                // add the creator of the group 
                await conversation.addMember(user) ; 
                // add the members 
                for (let index = 0 ; index < users.length ; index ++) 
                    await conversation.addMember(users[index]) ; 
                
                conversation.members = [ user , ...users ] ; 
                conversation.messages = [] ; 
                return conversation ; 
            } catch (error) {
                return new ApolloError(error.message)
            }
        }
    }
}