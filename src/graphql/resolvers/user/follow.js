import { ApolloError } from "apollo-server-express";

export default { 


    Query : { 

        getFollowers : async( _ , { offset , limit } , { db  , user }) =>  {
            
            // get the follwing users by offset and limit 
            return await user.getFollowers({ 
                offset , 
                limit 
            }) ; 

            

        }  , 

        getFollowing : async( _ , { offset , limit } , { db  , user }) =>  {  
        
        
            // get the follwing users by offset and limit 
            return await user.getFollowing({ 
                offset , 
                limit 
            }) ; 


        
        } 
    } , 


    Mutation : { 
        toggleFollow : async ( _  , { userId} , { db , user }) => { 

            try { 

                // check the user id 
                if (userId== user.id) 
                    throw new Error("You can't block your self asshole") ; 
                
                const target = await  db.User.findByPk(userId) ;
                if (target == null) 
                    throw new Error("User not found") ; 

     

                // check if the user is allready followed
                const following = await user.getFollowing({ 
                    where: { 
                        id : userId 
                    }
                }) ; 



                if ( following && following.length ==0 ) { 
                    // the user is not blocked 
                    await user.addFollowing(target) ; 
                    await user.update({ 
                        numFollowing : user.numFollowing +1 
                    })
                    await target.update({ 
                        numFollowers : target.numFollowers + 1 
                    }) ; 
                    return true  ; 
                } else { 
                    // the user is blocked 
                    // then unblock him / her 
                    await user.update({ 
                        numFollowing : user.numFollowing -1 
                    })
                    await target.update({ 
                        numFollowers : target.numFollowers - 1 
                    }) ; 
                    await user.removeFollowing(target) ; 
                    return false ; 
                }


            }catch(error) { 
                return new ApolloError(error.message) ; 
            }

            return user ; 
        }
    }

}