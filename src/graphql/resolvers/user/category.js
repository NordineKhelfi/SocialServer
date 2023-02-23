export default { 
    Query :{ 
        getCategories : async( _ , { } , { db  }) => {
            // return all categories ;  
            return await db.Category.findAll() ; 
        }
    }
}