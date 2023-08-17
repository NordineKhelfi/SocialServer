import { ApolloError } from "apollo-server-express"
import { UPLOAD_VALIDATION_DIR } from "../../../config";
import { ValidationRequestValidation } from "../../../validators";
import { deleteFiles, uploadFiles } from "../../../providers";


export default {
    Query: {
        getCurrentValidationRequest: async (_, { }, { db, user }) => {
            try {

                return await db.ValidationRequest.findOne({
                    where: {
                        userId: user.id
                    }
                });

            } catch (error) {
                return new ApolloError(error.message);
            }
        }

    },
    Mutation: {
        createValidationRequest: async (_, { validationRequestInput }, { db, user }) => {
            try {


                const request = await db.ValidationRequest.findOne({
                    where: {
                        userId: user.id
                    }
                });


                if (request)
                    throw new Error("All ready exists");

                // validate the input 
                await ValidationRequestValidation.validate(validationRequestInput, { abortEarly: true });

                // upload the file and save the media  
                const output = (await uploadFiles([validationRequestInput.media], UPLOAD_VALIDATION_DIR)).pop();

                const media = await db.Media.create({
                    path: output
                });

                // assign needed attributes 
                validationRequestInput.mediaId = media.id;
                validationRequestInput.media = media;
                validationRequestInput.userId = user.id;
                validationRequestInput.user = user;

                // inset the request to the database 
                return await db.ValidationRequest.create(validationRequestInput);


            } catch (error) {
                return new ApolloError(error.message);
            }
        },


        deleteValidationRequest: async (_, { }, { db, user }) => {
            try {

               
                const validationRequest = await db.ValidationRequest.findOne({
                    where: {
                        userId: user.id
                    },
                    include: [{
                        model: db.Media,
                        as: "media"
                    }]
                });

                if (!validationRequest)
                    throw new Error("You have no validation request to delete");


                if (validationRequest.media) {
                    await deleteFiles([validationRequest.media.path]);
                    await validationRequest.media.destroy();
                }

                await validationRequest.destroy();
                return validationRequest;

            } catch (error) {
                return new ApolloError(error.message);
            }
        }
    }
}