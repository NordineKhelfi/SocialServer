import { ApolloError } from "apollo-server-express"
import { compare } from "bcryptjs";
import { MONTH, removeAccount, setDayTimeout } from "../../../providers/user";

export default {
    Mutation: {
        removeAccount: async (_, { removeRequest, password }, { db, user }) => {
            try {

                // check the password 
                var isMath = await compare(password, user.password);

                if (!isMath)
                    throw new Error("Wrong password");

                const removeReason = await db.RemoveReason.findByPk(removeRequest.reasonId);
                if (!removeReason)
                    throw new Error("Reason not found");

                if (user.disabled) {
                    throw new Error("Your Account is already disabled");
                }

                await user.update({
                    disabled: true
                }); 

                removeRequest.user = user;
                removeRequest.userId = user.id;
                removeRequest.removeReason = removeReason
                var result = await db.RemoveRequest.create(removeRequest);
                removeRequest.id = result.id;
                
 
                setDayTimeout(() => removeAccount(db, user.id) , MONTH)
                return removeRequest;


            } catch (error) {
                console.log (error) ; 
                return new ApolloError(error.message);
            }
        },
        activateAccount: async (_, { }, { db, user }) => {
            try {
                
                if (!user.disabled)
                    throw new Error("Your account is already activated");

                const removeRequest = await user.getRemoveRequest();
                if (removeRequest)
                    removeRequest.destroy()

                await user.update({
                    disabled: false
                });

                return true;

            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }
}