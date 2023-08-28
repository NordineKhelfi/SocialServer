import { ApolloError } from "apollo-server-express"

export default {
    Query: {

        getWallet: async (_, { }, { db, user }) => {
            try {

                return await user.getWallet();

            } catch (error) {
                return new ApolloError(error.message);
            }
        }

    },
    Mutation: {

        createWallet: async (_, { }, { db, user }) => {
            try {

                const wallet = await user.getWallet();

                if (!wallet) {
                    return await user.createWallet()
                }

                return wallet;
            } catch (error) {
                return new ApolloError(error.message);
            }
        },


        deposit: async (_, { amount }, { db, user }) => {
            try {

                const wallet = await user.getWallet();
                if (!wallet)
                    throw new Error("Not wallet found");


                return await wallet.update({
                    funds: (wallet.funds + amount).toFixed(2)
                })

            } catch (error) {
                return new ApolloError(error.message);
            }
        },


        withdraw: async (_, { amount }, { db, user }) => {
            try {

                const wallet = await user.getWallet();
                if (!wallet) {
                    throw new Error("Wallet znot found");
                }

                if (amount > wallet.funds)
                    throw new Error("unseffisant funds");


                return await wallet.update({
                    funds: (wallet.funds - amount).toFixed(2)
                });



            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }
}