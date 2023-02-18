import { config } from "dotenv" 


const { parsed }  = config() ;

export const { 
    PORT  , 
    JWT_SECRET 
} = parsed
