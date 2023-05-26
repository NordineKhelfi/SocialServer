export default { 
    Query : { 
        getCurrentTimeTamps : async ( _ , { } , { }) => { 
            return new Date()  ;
        }
    }
}