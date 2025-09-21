import { NextFunction, Request, Response } from 'express';
import { Schema } from 'joi';

const validateRequest = (schema: Schema, property: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { value, error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      return res.status(400).json({
        error: 'Solicitud no permitida',
        details: error.details.map((detail) => detail.message),
      });
    }
    req[property] = value;
    next();
  };
};

export default validateRequest;
