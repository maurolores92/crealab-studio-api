import { CrudController } from '@src/core/helpers';
import { IOrderItem } from './orderItem.model';
import { orderItemService } from './orderItem.service';

class OrderItemController extends CrudController<IOrderItem> {
  constructor() {
    super(orderItemService, 'orderItem-controller');
  }
  
}

export const orderItemController = new OrderItemController();
