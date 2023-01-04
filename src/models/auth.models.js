import Joi from "joi";

export const authSignUpSchema = Joi.object({
  username: Joi.string().required().min(3),
  email: Joi.string().required().min(4),
  password: Joi.string().required().min(3),
  picture: Joi.string().required().min(3)
});

export const authSignInSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
}); 