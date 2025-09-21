import { CrudService } from '@src/core/helpers';
import { IOrderItem, OrderItem } from './orderItem.model';

import { Transaction } from 'sequelize';
import orderService from '../order.service';
import { Products } from '@src/modules/products/products.model';

class OrderItemService extends CrudService<IOrderItem> {
  constructor() {
    super(OrderItem, 'orderItem-service');
  }

  // TODO - Revisar el precio, debe ser por lo que selecciono
  public create = async (data: any, transaction: Transaction): Promise<IOrderItem> => {
    try {
      delete data.id;
      const item = await OrderItem.create(data, {transaction});
      // Descontar stock del producto
      if (data.productId && data.quantity) {
        const product = await Products.findByPk(data.productId, { transaction });
        if (product && typeof product.stock === 'number') {
          product.stock = Math.max(0, product.stock - data.quantity);
          await product.save({ transaction });
        }
      }
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
      // Restaurar stock del producto
      if (item.productId && item.quantity) {
        const product = await Products.findByPk(item.productId);
        if (product && typeof product.stock === 'number') {
          product.stock = product.stock + item.quantity;
          await product.save();
        }
      }
      await item.destroy();
      await orderService.updateOrderTotalAmount(orderId);
    }
}

export const orderItemService = new OrderItemService();