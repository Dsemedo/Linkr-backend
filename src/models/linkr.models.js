import Joi from "joi";

export const linkrSchema = Joi.object({
  link: Joi.string()
    .uri()
    .regex(
      /^(http(s):\/\/.)[-a-zA-Z0-9@:%.~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%.~#?&//=]*)$/
    )
    .required(),
  description: Joi.string(),
});
