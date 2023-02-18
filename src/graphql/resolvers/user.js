export default { 
    Query : { 

        Login : async ( _  ,  { identifier , password} , { db }) => { 

            var result = db.User.findAll() ;
            console.log(result) ; 

            return "Kachihaja" ; 
        }  
    } , 

    Mutation : { 
        SignUp : async( _ , { userInput }  , { db }) => {
            
            await db.User.create({ 
                name : "karim"  , 
                lastname : "tamani" , 
                email : "tamanikarim50@gmail.com" , 
                password : "kachihaja"
            })  ; 

            return "Kachihaja" ; 
        }  
    }
}