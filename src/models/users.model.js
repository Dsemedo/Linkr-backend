import Joi from "joi"

export const usersSchema = Joi.object({
  search: Joi.string().min(3).required(),
})
