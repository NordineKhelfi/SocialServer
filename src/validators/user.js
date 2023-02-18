import * as yup from "yup" ; 


const SignUpValidator = yup.object({
    name : yup.string().required().min(3).max(56) , 
    lastname : yup.string().required().min(3).max(56) ,
    email : yup.string().email().required() , 
    phone: yup.string().notRequired().matches(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g) , 
    password : yup.string().required().min(6).max(56) , 
    confirmPassword : yup.string().required().min(6).max(56) , 
    username : yup.string().required().min(6).max(56).matches(/^[a-zA-Z0-9]+$/) ,
    countryId : yup.number().required() , 
    gender : yup.boolean().required() , 
    birthday : yup.date().required() 
}) ; 


export { 
    SignUpValidator 
}