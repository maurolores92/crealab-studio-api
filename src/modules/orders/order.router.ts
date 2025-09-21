import orderController from './order.controller';
import { CrudRouter } from '@src/core/helpers/database/crud.router';
import { IOrder } from './order.model';
import { orderItemRouter } from './items/orderItem.router';
import { orderStatusRouter } from './status/orderStatus.router';
import { apiTokenValidation } from '@src/core/middleware';
import { orderHistoryRouter } from './history/orderHistory.router';
import Context from '@src/core/middleware/context';
import { optionalTokenValidation } from '@src/core/middleware/optionalToken.middleware';

class OrderRouter extends CrudRouter<IOrder> {

  constructor() {
    super('/orders', orderController);
    this.router.use(orderItemRouter.basePath, orderItemRouter.router);
    this.router.use(orderStatusRouter.basePath, orderStatusRouter.router);
    this.router.use(orderHistoryRouter.basePath, orderHistoryRouter.router);
    this.prepareRouters();
  }

  prepareRouters = () => {
    this.router.post('/', [optionalTokenValidation], orderController.create);
    this.router.get('/:id/resume', [optionalTokenValidation], orderController.resumeOrder);
    this.router.get('/', [apiTokenValidation], orderController.all);
    this.router.get('/paid', [apiTokenValidation, Context.create], orderController.allPaid);
    this.router.get('/:id', [apiTokenValidation, Context.create], orderController.find);
    this.router.put('/status', [apiTokenValidation, Context.create], orderController.changeStatus);
    this.router.get('/:id/pdf', [], orderController.generateOrder);
    this.router.get('/byClient/:clientId', [apiTokenValidation, Context.create], orderController.byClient);
    this.router.put('/:id/markAsPaid', [apiTokenValidation, Context.create], orderController.markAsPaid);
  };

}

export default new OrderRouter();