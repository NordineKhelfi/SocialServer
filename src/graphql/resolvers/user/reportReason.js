

export default { 
    Query : {
        getReportReasons : async ( _ , { } , { db , user }) => { 
            return db.ReportReason.findAll() ; 
        }
    }
}