import { CrudRouter } from '@src/core/helpers/database/crud.router';
import Context from '@src/core/middleware/context';
import { ICategory } from './category.model';
import { categoryController } from './category.controller';

class CategoryRouter extends CrudRouter<ICategory> {
  constructor() {
    super('/categories', categoryController);
    this.customRouter();
    this.initRoutes([Context.create]);
  }
  public customRouter() {
    this.router.get('/actives', [], categoryController.actives);
    this.router.get('/actives-products', [], categoryController.activesWithProducts);
  }
}

export const categoryRouter = new CategoryRouter();
