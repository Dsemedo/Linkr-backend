import Joi from "joi";

export const authSignUpSchema = Joi.object({

});

export const authSignInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
}); 