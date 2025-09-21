import { CrudRouter } from '@src/core/helpers/database/crud.router';
import Context from '@src/core/middleware/context';
import { apiTokenValidation } from '@src/core/middleware';
import { orderHistoryController } from './orderHistory.controller';
import { IOrderHistory } from './orderHistory.model';

class OrderHistoryRouter extends CrudRouter<IOrderHistory> {
  constructor() {
    super('/history', orderHistoryController);
    this.prepareRoutes();
    this.initRoutes([apiTokenValidation, Context.create]);
  }
  private prepareRoutes = () => {
    this.router.get('/:orderId', orderHistoryController.all);
  
  }
}

export const orderHistoryRouter = new OrderHistoryRouter();
