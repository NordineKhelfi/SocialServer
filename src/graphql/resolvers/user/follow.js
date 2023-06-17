import { ApolloError } from "apollo-server-express";
import { Op, Sequelize } from "sequelize";

export default {


    Query: {

        getFollowers: async (_, {query ,  offset, limit }, { db, user }) => {
            

            if ( ! query ) { 
                query = "" ; 
            }

            query = query.trim().split(" ").filter(word => word != "").join("") ; 
         

            // get the follwing users by offset and limit 
            var follows = await user.getFollowers({
                include: [{
                    model: db.User,
                    as: "user" , 
                    where : {
                        [Op.or]: [
                            Sequelize.where(
                                Sequelize.fn("CONCAT", Sequelize.col("name") , Sequelize.col("lastname")), {
                                [Op.like]: `%${query}%`
                            }
                            ),
                            Sequelize.where(
                                Sequelize.fn("CONCAT", Sequelize.col("lastname") , Sequelize.col("name")), {
                                [Op.like]: `%${query}%`
                            }),
                            {
                                username: {
                                    [Op.like]: `%${query}%`
                                }
                            }
                        ]
                    } , 
                    include : [{ 
                        model : db.Media , 
                        as : "profilePicture"
                    }]
                }],
                offset,
                limit
            });


            return follows.map( follow => follow.user ) ; 

        },

        getFollowing: async (_, { query , offset, limit }, { db, user }) => {

            if ( ! query ) { 
                query = "" ; 
            }

            query = query.trim().split(" ").filter(word => word != "").join("") ; 
            
            // get the follwing users by offset and limit 
            var follows =  await user.getFollowing({
                include: [{
                    model: db.User,
                    as: "following" , 
                    where : {
                        [Op.or]: [
                            Sequelize.where(
                                Sequelize.fn("CONCAT", Sequelize.col("name") , Sequelize.col("lastname")), {
                                [Op.like]: `%${query}%`
                            }
                            ),
                            Sequelize.where(
                                Sequelize.fn("CONCAT", Sequelize.col("lastname") , Sequelize.col("name")), {
                                [Op.like]: `%${query}%`
                            }),
                            {
                                username: {
                                    [Op.like]: `%${query}%`
                                }
                            }
                        ]
                    } , 
                    include : [{ 
                        model : db.Media , 
                        as : "profilePicture"
                    }]
                }],
                offset,
                limit
            });
            return follows.map(follow => follow.following) ; 

        } , 
       
    },


    Mutation: {
        toggleFollow: async (_, { userId }, { db, user, sendPushNotification , pubSub }) => {

            try {

                // check the user id 
                if (userId == user.id)
                    throw new Error("You can't follow your self asshole");

                
                const blockedUser = await db.BlockedUser.findOne({ 
                    where : {
                        [Op.or] : [
                            {
                                userId : userId , 
                                blockedUserId : user.id  
                            } , 
                            { 
                                blockedUserId : userId , 
                                userId  : user.id
                            }
                        ]
                    } 
                }) ; 

                if (blockedUser) 
                    throw new Error("this user is blocked") ; 

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
                    var follow = await db.Follow.create({
                        userId: user.id,
                        followingId: target.id
                    });
                    await user.update({
                        numFollowing: user.numFollowing + 1
                    })
                    await target.update({
                        numFollowers: target.numFollowers + 1
                    });

                    user.profilePicture = await user.getProfilePicture() ; 
                    sendPushNotification(
                        target,
                        {
                            type: "follow", user: {
                                id : user.id , 
                                name: user.name,
                                lastname: user.lastname,
                                profilePicture: user.profilePicture 
                            }
                        }
                    );
                    var isFollowed = false ; 
              
                    var isFollowed = (await user.getFollowers({
                        where : { 
                            userId : target.id 
                        }
                    })).pop() != null ; 
                
                    follow.createdAt = new Date() ; 
                    follow.user = user ;  
                    follow.user.isFollowed = isFollowed ; 
                    pubSub.publish("NEW_FOLLOW" , { 
                        newFollow : follow  
                    }) ; 



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