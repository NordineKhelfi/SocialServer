import { ApolloError } from "apollo-server-express";
import { SignUpValidator , LoginValidator } from "../../validators/user";
import { hash, compare } from "bcryptjs";
import { createToken } from "../../providers/jwt";
import { Op } from "sequelize" ; 
export default {
    Query: {

        Login: async (_, { identifier, password }, { db }) => {

            try {

                await LoginValidator.validate({ identifier, password }, { abortEarly: true });
                // get user that identifier match his email or phone number 
                var user = await db.User.findOne({
                    where: {

                        [Op.or]: [
                            { email: identifier },
                            { phone: identifier }
                        ]
                    }
                });
                // there is no user with the given identifier 
                if (user == null)
                    throw new Error("Identifier not valid");


                // check the password 
                var isMath = await compare(password, user.password);

                if (!isMath)
                    throw new Error("Wrong password");

                // create token 
                var token = createToken(user.email, user.password);

                return {
                    user: user,
                    token: token
                }
            } catch (error) {
                return new ApolloError(error.message);
            }

        }
    },

    Mutation: {
        SignUp: async (_, { user }, { db }) => {
            try {
                // validate inputs 
                await SignUpValidator.validate(user, { abortEarly: true })
                // check the password confirmation 
                if (user.password != user.confirmPassword)
                    throw Error("Password not match");

                user.password = await hash(user.password, 10);
                // create token 
                var token = await createToken(user.email, user.password);
                // create and return user 
                var user = await db.User.create(user);


                return {
                    user,
                    token
                }

            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }
}