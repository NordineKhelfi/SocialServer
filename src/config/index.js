import { config } from "dotenv"
const { parsed } = config();

// export const mailConfig = {  
//     email : "vinkst0@gmail.com" , 
//     clientId : "788968954733-bu3g9mok7pam1k5i2g2c7g12i1de0q27.apps.googleusercontent.com" ,
//     clientSecret : "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" , 
//     refreshToken : "1//04FV50GoDkVZCCgYIARAAGAQSNwF-L9Ire7rUx90eQcHyuBucIdroK0ApTqruzxc8a9CagWi3o9p76RiSJGxy8iEbDNoDu9YhKH8" 
// }
export const mailConfig = {  
    email : "khairallahghazi@gmail.com" , 
    clientId : "1061580292307-tmvn3813dq5rmn0tk1jqpl5t7e64fdp9.apps.googleusercontent.com" ,
    clientSecret : "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" , 
    refreshToken : "1//03qZX8DPyOg54CgYIARAAGAMSNwF-L9IrnUDbKYVMH-Fm2AGT8Ycb_i8y9HUiXgdDDDbkJTNG8fBHdiR9nre0NDYim2SkgcU9LoI" 
}

export const {
    PORT,
    JWT_SECRET,
    UPLOAD_POST_IMAGES_DIR,
    UPLOAD_POST_VIDEOS_DIR,
    UPLOAD_COMMENTS_RECORDS_DIR,
    UPLOAD_REPLAYS_RECORDS_DIR,
    UPLOAD_STORIES_DIR,
    ASSETS , 
    UPLOAD_MESSAGE_IMAGES_DIR,
    UPLOAD_MESSAGE_VIDEOS_DIR,
    UPLOAD_MESSAGE_RECORDS_DIR,
    UPLOAD_VALIDATION_DIR , 
    UPLOAD_PICTURES_DIR , 
    UPLOAD_POST_THUMBNAILS_DIR , 
    UPLOAD_POST_WORKS_DIR , 
    UPLOAD_POST_SERVICES_DIR
    
} = parsed 
