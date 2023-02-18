import { JWT_SECRET } from "../config";
import { verify } from "jsonwebtoken";
import db from "../../models";


export const userAuth = async (request, response, next) => {

    const token = request.get('Authorization');

    // check if there is a token in http request header
    if (!token || token.trim() == "") {
       
        request.isUserAuth = false;
        return next();
    }


    let decodedToken = null;
    // decode token 
    try {
        decodedToken = await verify(token, JWT_SECRET);
    } catch (error) {
        request.isUserAuth = false;
        return next();
    }
    // if the decode token is not valid set auth to false move to next middleware 
    if (!decodedToken) {
        request.isUserAuth = false;
        return next();
    }
 
    // check if realy this token belongs to a valid doctor 
    var user = await db.User.findOne({
        where: {
            "email": decodedToken.identifier,
            "password": decodedToken.password
        }
    });

    // check if there is a valid user 
    if (!user) {
        request.isUserAuth = false;
        return next();
    }
    
    // assing the user and validation to the request 
    request.user = user ; 
    request.isUserAuth = true  ; 

    return next() ; 
 

}