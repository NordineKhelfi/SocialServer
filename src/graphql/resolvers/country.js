export default { 
    Query : { 
        getCountries : async ( _ ,  { } ,  { db }) => {
            // get all the countries in the dayabase ;  
            return db.Country.findAll() ; 
 
        } 
    }
}