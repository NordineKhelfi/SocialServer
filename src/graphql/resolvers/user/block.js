import { ApolloError } from "apollo-server-express";
import { Op } from "sequelize";

export default { 


    Query : { 

        getBlockedUsers : async( _ , { offset , limit } , { db  , user }) =>  {  
            
            // get blocked users by offset and limit 
            
            
            var blockedUsers =  await db.BlockedUser.findAll({                
                include : [{
                    model : db.User , 
                    as : "blocking" , 
                    include : [{
                        model : db.Media , 
                        as  : "profilePicture"
                    }]
                }]  , 

                where : { 
                    userId : user.id , 
                } , 
                offset : offset , 
                limit : limit , 
                order : [["createdAt" , "DESC"]]   
            }) ; 

            return blockedUsers.map(blockedUser => blockedUser.blocking) ; 


        } 
    } , 


    Mutation : { 
        toggleBlock : async ( _  , { userId} , { db , user }) => { 
            
            try { 

                // check the user id 
                if (userId== user.id) 
                    throw new Error("You can't block your self asshole") ; 
                
                const target = await  db.User.findByPk(userId) ;
                if (target == null) 
                    throw new Error("User not found") ; 
                    
                    

                // check if the user is allready blocked
                const blockedUsers =( await user.getBlockedUsers({ 
                    where: { 
                        blockedUserId : userId 
                    }
                })).pop() ; 


                if ( !blockedUsers  ) { 
                    // the user is not blocked 
    
                    var follower = await db.Follow.findOne({ 
                        where : { 
                            userId : target.id ,
                            followingId : user.id  
                        }
                    }) ; 


                    var following = await db.Follow.findOne({ 
                        where : { 
                            userId : user.id ,
                            followingId : target.id  
                        }
                    }) ; 
               
                    if (follower) { 

                        await user.update({
                            numFollowers: user.numFollowers - 1
                        })
                        await target.update({
                            numFollowing: target.numFollowing - 1
                        });   
                        
                        follower.destroy() ; 
                    } 

                    if (following) { 
                        await user.update({
                            numFollowing: user.numFollowing - 1
                        })
                        await target.update({
                            numFollowers: target.numFollowers - 1
                        });
                        following.destroy() ; 
                    }

                    
                         
                    await db.BlockedUser.create({
                        userId : user.id , 
                        blockedUserId : target.id 
                    }) ; 


                    return true  ; 
                } else { 
                    // the user is blocked 
                    // then unblock him / her 
                    
                    await blockedUsers.destroy() ; 
                    return false ; 
                }

                
            }catch(error) { 
                return new ApolloError(error.message) ; 
            }
 
        }
    }

}