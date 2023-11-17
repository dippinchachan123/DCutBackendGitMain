import {ObjectSchema} from "joi";
import express from "express";
// import {schema} from "./controllers/user/verify_email";

export const generateErr = (res: express.Response, errors: any, code: number = 400) => {
  
  let custom

  Array.isArray(errors)? custom = errors : custom = [{param:'', message: errors}];  

  return res.status(code).json({
      'status': 'failed',
      'errors': custom
  });
}

export const generateSucc = (res: express.Response, message: string, data: any = null) => {
    return res.status(200).json({
        'status': 'success',
        'message': message,
        'data': data
    });
}

export const validateRequest = (schema: ObjectSchema, params: any, res: express.Response) => {
    const options = {
        errors: {
          wrap: {
            label: ''
          }
        },
        abortEarly: false
      };

    const result = schema.validate(params, options);
    
    // format of error handler with array  
    let resArray = [];
    if(result.error){
        result.error.details.forEach((element) => {
            switch (element.type) {
                case "any.required": 
                  element.message = "is required!";
                  break;
                case "any.empty":
                  element.message = "should not be empty!";
                  break;
                case "string.empty":
                    element.message = "should not be empty!";
                    break;
                case "string.email":
                    element.message = "should be valid!";
                    break;
                case "string.min":
                  element.message = `should have at least ${element.context.limit} characters!`;
                  break;
                case "string.max":
                  element.message = `should have at most ${element.context.limit} characters!`;
                  break;
                case "any.only": 
                  element.message = element.message;
                  break;
                default:
                  break;
              }
            resArray.push({param:element.context.key, message: element.message});
        })
        return generateErr(res, resArray);
    }
    
    return false;
}
