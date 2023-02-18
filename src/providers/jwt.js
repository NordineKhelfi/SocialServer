import { sign } from "jsonwebtoken"
import { JWT_SECRET } from "../config";

export const createToken = async(identifier, password) => {
    return await sign({ identifier, password }, JWT_SECRET, {
        expiresIn: "99 years"
    })
}