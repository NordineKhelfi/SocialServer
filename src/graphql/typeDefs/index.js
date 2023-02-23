import user from "./user" ; 
import route from "./route" ; 
import post from "./post";
import message from "./message";
export default [
    route , 
    ...user , 
    ...post , 
    ...message
]
