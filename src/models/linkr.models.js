import Joi from "joi";

export const linkrSchema = Joi.object({
  link: Joi.string().uri().required(),
  description: Joi.string().allow(""),
});
