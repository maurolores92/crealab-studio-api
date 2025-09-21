import { CrudRouter } from '@src/core/helpers/database/crud.router';
import { apiTokenValidation } from '@src/core/middleware';
import { orderItemController } from './orderItem.controller';
import Context from '@src/core/middleware/context';
import { IOrderItem } from './orderItem.model';

class OrderItemRouter extends CrudRouter<IOrderItem> {
  constructor() {
    super('/items', orderItemController);
    this.initRoutes([apiTokenValidation, Context.create]);
  }
}

export const orderItemRouter = new OrderItemRouter();
