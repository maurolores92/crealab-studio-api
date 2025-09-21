import { CrudService } from '@src/core/helpers';
import { IOrderHistory, OrderHistory } from './orderHistory.model';

class OrderHistoryService extends CrudService<IOrderHistory> {
  constructor() {
    super(OrderHistory, 'order-history-service');
  }
  public allHistory = async({ orderId }: { orderId: string }): Promise<IOrderHistory[]> => {
    return OrderHistory.findAll({ where: {orderId}, order: [['createdAt', 'desc']] });
  }
}

export const orderHistoryService = new OrderHistoryService();