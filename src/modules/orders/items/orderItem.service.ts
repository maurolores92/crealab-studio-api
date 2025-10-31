import { CrudService } from '@src/core/helpers';
import { IOrderItem, OrderItem } from './orderItem.model';

import { Transaction } from 'sequelize';
import orderService from '../order.service';
import { wordpressService } from '@src/modules/wordpress/wordpress.service';

class OrderItemService extends CrudService<IOrderItem> {
  constructor() {
    super(OrderItem, 'orderItem-service');
  }

  // TODO - Revisar el precio, debe ser por lo que selecciono
  public create = async (data: any, transaction: Transaction): Promise<IOrderItem> => {
    try {
      delete data.id;
      if (data.productId && data.quantity) {
        await wordpressService.adjustProductStock(data.productId, -data.quantity);
      }
      const item = await OrderItem.create(data, { transaction });
      await orderService.updateOrderTotalAmount(item.orderId);
      return item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

    public override remove = async (id: number): Promise<any> => {
      const item = await OrderItem.findByPk(id);
      if (!item) return;
      const orderId = item.orderId;
      if (item.productId && item.quantity) {
        await wordpressService.adjustProductStock(item.productId, item.quantity);
      }
      await item.destroy();
      await orderService.updateOrderTotalAmount(orderId);
    }
}

export const orderItemService = new OrderItemService();