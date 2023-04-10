import { ApolloError } from "apollo-server-express";
import { hash, compare } from "bcryptjs";
import { createToken } from "../../../providers/jwt";
import { Op } from "sequelize";
import { SocialMediaValidator, SignUpValidator, LoginValidator } from "../../../validators";
import { deleteFiles, uploadFiles } from "../../../providers";
import { UPLOAD_PICTURES_DIR } from "../../../config";
import Sequelize from "sequelize";
export default {
    Query: {

        checkUsername: async (_, { username }, { db, user }) => {
            // chek the username is taken 
            const existsUser = await db.User.findOne({
                subQuery: true,
                where: {
                    username: username.trim(),
                    id: {
                        [Op.not]: (user) ? (user.id) : (null)
                    }
                }
            });
            return existsUser == null;
        },
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
                    },
                    include: [{
                        model: db.Media,
                        as: "profilePicture"
                    }]
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

        },
        getUserById: async (_, { userId }, { db, user }) => {
            // find user by the given id 
            // and add associations 
            const profile = await db.User.findByPk(userId, {

                include: [{
                    model: db.Country,
                    as: "country"
                }, {
                    model: db.SocialMedia,

                    as: "socialMedia"
                }, {
                    model: db.Media,
                    as: "profilePicture"
                }]
            });



            if (user) {
                profile.isFollowed = (await user.getFollowing({
                    where: {
                        followingId: profile.id
                    }
                })).length > 0;

            } else {
                profile.isFollowed = false;
            }

            return profile
        },

        suggestUsers: async (_, { offset, limit }, { db, user }) => {


            var followingsIds = (await user.getFollowing()).map((following) => following.followingId);
            followingsIds.push(user.id);




            var users = await db.User.findAll({



                include: [{
                    model: db.Media,
                    as: "profilePicture"
                }, {
                    model: db.Follow,
                    as: "followers",

                    include: [{
                        model: db.User,
                        as: "user",
                    }],

                }],


                where: {
                    id: {
                        [Op.notIn]: followingsIds
                    }
                },
                limit: [offset, limit],
                order: [
                    ["createdAt", "DESC"]
                ]

            });





            return users;
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
        },

        EditProfile: async (_, { userInput }, { user, db }) => {


            try {

                // check if the social media need to be updated 
                if (userInput.socialMedia) {
                    // apply a validation for the input

                    await SocialMediaValidator.validate(userInput.socialMedia, { abortEarly: true })

                    // whene we reach this point we are sure that social media is set and validated 
                    // check if the user allready set some social media account or this is his first time 

                    const previousSocialMedia = await user.getSocialMedia();

                    if (!previousSocialMedia) {
                        await user.createSocialMedia(userInput.socialMedia);
                    } else {
                        await previousSocialMedia.update(userInput.socialMedia);
                    }
                }


                // check if the user upload new profile picture 
                if (userInput.profilePicture) {
                    // check if the user have a previous profile picture 
                    const picture = await user.getProfilePicture();
                    if (picture) {
                        // if so delete it from the server storage 
                        // and delete it from the database 
                        await deleteFiles([picture.path]);

                        await picture.destroy();
                    }
                    // if the user upload new picture 
                    // save it in the pictures directory and assign it to the given user
                    const output = (await uploadFiles([userInput.profilePicture], UPLOAD_PICTURES_DIR)).pop();
                    const media = await db.Media.create({
                        path: output
                    });
                    userInput.pictureId = media.id;
                }
                else if (!userInput.pictureId) {
                    const picture = await user.getProfilePicture();
                    if (picture) {
                        // if so delete it from the server storage 
                        // and delete it from the database 
                        await deleteFiles([picture.path]);

                        await picture.destroy();
                    }
                }
                return await user.update(userInput);;

            } catch (error) {
                return new ApolloError(error.message);
            }
        },
        toggleDisable: async (_, { }, { db, user }) => {
            return await user.update({ disabled: !user.disabled });
        },
        togglePrivate: async (_, { }, { db, user }) => {
            return await user.update({ private: !user.private });

        },
        deleteAccount: async (_, { }, { db, user }) => {
            return await user.destroy();
        }


    }
}