import  * as yup from "yup" ;  


export const ReplayValidator = yup.object( { 
    commentId : yup.number().required() , 
    replay : yup.string().notRequired().max(255) , 
}).test("replay-content" , "Replay Content not Found" , (replay) => { 
    return replay.replay || replay.media ; 
})