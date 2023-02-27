import { ApolloError } from "apollo-server-express"
import { UPLOAD_VALIDATION_DIR } from "../../../config";
import { ValidationRequestValidation } from "../../../validators";
import { uploadFiles} from "../../../providers" ; 


export default {
    Query: {

    },
    Mutation: {
        createValidationRequest: async (_, { validationRequestInput }, { db, user }) => {
            try {
                // validate the input 
                await ValidationRequestValidation.validate(validationRequestInput , { abortEarly : true}) ; 
                
                 // upload the file and save the media  
                const output = ( await uploadFiles([ validationRequestInput.media] , UPLOAD_VALIDATION_DIR ) ).pop() ; 
                 
                const media = await db.Media.create({ 
                    path : output 
                }) ; 

                // assign needed attributes 
                validationRequestInput.mediaId = media.id ; 
                validationRequestInput.media = media ; 
                validationRequestInput.userId = user.id  ; 
                validationRequestInput.user = user ; 

                // inset the request to the database 
                const result = await db.ValidationRequest.create(validationRequestInput) ; 
                validationRequestInput.id = result.id ; 
                return validationRequestInput ;  

            
            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }
}