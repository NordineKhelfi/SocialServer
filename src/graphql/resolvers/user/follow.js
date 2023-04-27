import { ApolloError } from "apollo-server-express";

export default {


    Query: {

        getFollowers: async (_, { offset, limit }, { db, user }) => {

            // get the follwing users by offset and limit 
            return await user.getFollowers({
                include: [{
                    model: db.User,
                    as: "user"
                }],
                offset,
                limit
            });

        },

        getFollowing: async (_, { offset, limit }, { db, user }) => {


            // get the follwing users by offset and limit 
            return await user.getFollowing({
                include: [{
                    model: db.User,
                    as: "following"
                }],
                offset,
                limit
            });



        }
    },


    Mutation: {
        toggleFollow: async (_, { userId }, { db, user, sendPushNotification }) => {

            try {

                // check the user id 
                if (userId == user.id)
                    throw new Error("You can't follow your self asshole");

                const target = await db.User.findByPk(userId);
                if (target == null)
                    throw new Error("User not found");

                // check if the user is allready followed
                const following = (await user.getFollowing({
                    where: {
                        followingId: userId
                    }
                })).pop();

                if (!following) {
                    // the user is not blocked 
                    await db.Follow.create({
                        userId: user.id,
                        followingId: target.id
                    });
                    await user.update({
                        numFollowing: user.numFollowing + 1
                    })
                    await target.update({
                        numFollowers: target.numFollowers + 1
                    });


                    sendPushNotification(
                        target,
                        {
                            type: "follow", user: {
                                name: user.name,
                                lastname: user.lastname,
                                profilePicture: await user.getProfilePicture()
                            }
                        }
                    );

                    return true;

                } else {
                    // the user is blocked 
                    // then unblock him / her 
                    await user.update({
                        numFollowing: user.numFollowing - 1
                    })
                    await target.update({
                        numFollowers: target.numFollowers - 1
                    });

                    await following.destroy();

                    return false;
                }


            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }

}