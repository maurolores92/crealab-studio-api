import Joi from 'joi';

interface IProductRequest {
  pageSize: number;
  page: number;
  category?: string;
  startPrice?: number;
  endPrice?: number;
  categorySlug?: string;
}

const productRequestSchema = Joi.object<IProductRequest>({
  pageSize: Joi.number().integer().default(100),
  page: Joi.number().integer().default(0),
  category: Joi.string(),
  startPrice: Joi.number(),
  categorySlug: Joi.string(),
  endPrice: Joi.number().when('startPrice', {
    is: Joi.exist(), 
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

export { productRequestSchema, IProductRequest };