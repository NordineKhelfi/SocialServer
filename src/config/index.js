import { config } from "dotenv" 


const { parsed }  = config() ;

export const { 
    PORT  , 
    JWT_SECRET , 
    UPLOAD_POST_IMAGES_DIR , 
    UPLOAD_POST_VIDEOS_DIR
} = parsed
