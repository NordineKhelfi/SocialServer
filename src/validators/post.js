import * as yup from "yup";


export const PostValidator = yup.object({
    type: yup.string().required().oneOf(["note", "reel", "image", "work", "service"]),
    title: yup.string().notRequired().max(255),
    media: yup.array().notRequired(),    
})
    .test("note-text", "Note Text is required", (postInput) => {
        if (postInput.type == "note" && (!postInput.title || postInput.title.trim().length == 0))
            return false;
        return true;
    })
    .test("media-content", "Media Content not found", (postInput) => {
        if ((postInput.type == "reel" || postInput.type == "image") && (!postInput.media || postInput.media.length == 0))
            return false;
        return true;
    })
    .test("work-content", "Work Data not found", (postInput) => {
        if (postInput.type == "work" && (!postInput.workInput || !postInput.media || postInput.media.length == 0))
            return false;
        return true;
    })
    .test("service-content", "Service Data not found", (postInput) => {
        if (postInput.type == "service" && (!postInput.serviceInput || !postInput.media || postInput.media.length == 0) )
            return false;
        return true;
    })

export const WorkValidator = yup.object({
    categoryId: yup.number().required(),
})

export const ServiceValidator = yup.object({
    categoryId: yup.number().required(),
    period: yup.number().required().min(1),
    price: yup.number().required().min(1),
})
