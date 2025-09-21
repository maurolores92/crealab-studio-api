import { CrudRouter } from '@src/core/helpers/database/crud.router';
import { apiTokenValidation } from '@src/core/middleware';
import Context from '@src/core/middleware/context';
import { IOrderStatus } from './orderStatus.model';
import { orderStatusController } from './orderStatus.controller';

class OrderStatusRouter extends CrudRouter<IOrderStatus> {
  constructor() {
    super('/status', orderStatusController);
    this.initRoutes([apiTokenValidation, Context.create]);
  }
}

export const orderStatusRouter = new OrderStatusRouter();
