import  * as yup from "yup" ;  


export const CommentValidator = yup.object( { 
    postId : yup.number().required() , 
    comment : yup.string().notRequired().max(255) , 
}).test("comment-content" , "Comment Content not Found" , (comment) => { 
    return comment.comment || comment.media ; 
})