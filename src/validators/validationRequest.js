import * as yup from "yup" ; 


const ValidationRequestValidation = yup.object({ 
    name : yup.string().required().min(3).max(255) , 
    lastname : yup.string().required().min(3).max(255) ,
    fileType : yup.string().required().oneOf([ "بطاقة تعريف", "رخصة قيادة", "جواز السفر"]) , 
    countryId : yup.number().required() , 
    categoryId : yup.number().required(), 
    linkOne : yup.string().required()  , 
    linkTwo: yup.string().notRequired()  , 
}) ; 

export { 
    ValidationRequestValidation
}



