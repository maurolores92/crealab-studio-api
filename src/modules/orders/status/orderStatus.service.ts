import { CrudService } from '@src/core/helpers';
import { IOrderStatus, OrderStatus } from './orderStatus.model';

class OrderStatusService extends CrudService<IOrderStatus> {
  constructor() {
    super(OrderStatus, 'order-status-service');
  }
  public allStatus = async(): Promise<IOrderStatus[]> => {
    const all = await OrderStatus.findAll();
    return all.filter(status => status.slug !== 'paid');
  };
}

export const orderStatusService = new OrderStatusService();