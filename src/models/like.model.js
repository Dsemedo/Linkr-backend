import Joi from "joi";

export const likeSchema = Joi.object({
  idPost: Joi.number().required()
});
