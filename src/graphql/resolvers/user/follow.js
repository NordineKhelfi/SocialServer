export default { 


    Query : { 

        getFollowers : async( _ , { offset , limit } , { db  , user }) =>  {  
        }  , 

        getFollowing : async( _ , { offset , limit } , { db  , user }) =>  {  
        } 
    } , 


    Mutation : { 
        toggleFollow : async ( _  , { userId} , { db , user }) => { 

            return user ; 
        }
    }

}