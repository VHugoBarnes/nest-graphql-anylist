import * as Joi from "joi";

export const JoiValidationSchema = Joi.object({
  DB_PASSWORD: Joi.required(),
  DB_NAME: Joi.required(),
  DB_HOST: Joi.required(),
  DB_PORT: Joi.required(),
  DB_USER: Joi.required(),
  PORT: Joi.number().default(9999),
  HOST_API: Joi.string().required(),
  JWT_SECRET: Joi.string().required().min(20),
  STATE: Joi.string().required(),
});