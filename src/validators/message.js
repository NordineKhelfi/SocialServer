import * as yup from "yup" ; 


const MessageValidator = yup.object({ 
    conversationId : yup.number().required() , 
    type : yup.string().required().oneOf(["text", "image", "video", "record"]) , 
    content : yup.string().notRequired()  
})

.test("text-not-valid" , "Please provide text" , (message) => { 
 
    return !(message.type == "text" && (!message.content || (message.content.trim().length == 0))) ; 
})
.test("media-not-valid" , "Please provide media" , (message) => { 
    return !(message.type != "text" && !(message.media)) ; 
})


export { 
    MessageValidator 
}