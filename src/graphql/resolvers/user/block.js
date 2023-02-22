import { ApolloError } from "apollo-server-express";

export default { 


    Query : { 

        getBlockedUsers : async( _ , { offset , limit } , { db  , user }) =>  {  
            // get blocked users by offset and limit 
            return await user.getBlockedUsers({                
                offset : offset , 
                limit : limit 
            }) ; 

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
                const blockedUsers = await user.getBlockedUsers({ 
                    where: { 
                        id : userId 
                    }
                }) ; 


                if ( blockedUsers && blockedUsers.length ==0 ) { 
                    // the user is not blocked 
                    await user.addBlockedUser(target) ; 
                    return true  ; 
                } else { 
                    // the user is blocked 
                    // then unblock him / her 
                    
                    await user.removeBlockedUser(target) ; 
                    return false ; 
                }

                
            }catch(error) { 
                return new ApolloError(error.message) ; 
            }
 
        }
    }

}