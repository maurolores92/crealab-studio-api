import { CrudRouter } from '@src/core/helpers/database/crud.router';
import Context from '@src/core/middleware/context';
import { IProducts } from './products.model';
import { productsController } from './products.controller';
import { apiTokenValidation } from '@src/core/middleware';
import { stockDistributionRouter } from './stock/stockDistribution.router';
import { productInventoryRouter } from './inventory/productInventory.router';
import { categoryRouter } from './categories/category.router';
import validateRequest from '@src/core/middleware/schemaValidator.middleware';
import { productRequestSchema } from './product.schema';
import { optionalTokenValidation } from '@src/core/middleware/optionalToken.middleware';

class ProductsRouter extends CrudRouter<IProducts> {
  constructor() {
    super('/products', productsController);

    this.router.use(categoryRouter.basePath, categoryRouter.router);
    this.router.use(stockDistributionRouter.basePath, stockDistributionRouter.router);
    this.router.use(productInventoryRouter.basePath, productInventoryRouter.router);
    this.prepareRouters();
    this.initRoutes([apiTokenValidation, Context.create]);
  }

  private prepareRouters = () => {
    this.router.get('/bySku/:sku', [optionalTokenValidation], productsController.bySku);
    this.router.get('/similars/:id', [optionalTokenValidation], productsController.similars);
    this.router.post(
      '/import', 
      [apiTokenValidation, Context.create], 
      productsController.importExcel
    );
    this.router.get(
      '/export', 
      [apiTokenValidation, Context.create], 
      productsController.exportExcel
    );
    this.router.post('/add-gallery', [apiTokenValidation, Context.create], productsController.addGallery);
    this.router.get('/actives', [optionalTokenValidation, validateRequest(productRequestSchema, 'query')], productsController.actived);
    this.router.post('/:id/uploadMainImage', [apiTokenValidation, Context.create], productsController.uploadMainImage);
    this.router.delete('/:id/deleteMainImage', [apiTokenValidation, Context.create], productsController.deleteMainImage);
    this.router.delete('/:id/gallery/:galleryId', [apiTokenValidation, Context.create], productsController.deleteGalleryImage);
  };
  
}

export const productsRouter = new ProductsRouter();
