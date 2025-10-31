
import { IOrder, Order } from './order.model';
import { CrudService } from '@src/core/helpers';
import { sequelize } from '@src/core/configurations';
import { OrderStatus } from './status/orderStatus.model';
import { OrderItem } from './items/orderItem.model';
import { Client } from '../clients/client.model';
import { OrderHistory } from './history/orderHistory.model';
import { pdfService } from '@src/core/pdf/pdf.service';
import { DateTime } from 'luxon';
import { Address } from '../clients/address/address.model';
import { Province } from '../clients/address/province.model';
import { Op } from 'sequelize';

class OrderService extends CrudService<IOrder> {

  constructor() {
    super(Order, 'order-service');
  }

  public async getPaidStatus() {
    return await OrderStatus.findOne({ where: { slug: 'paid' } });
  }

  public all = async (paginateRequest: any): Promise<any> => {
    const paidStatus = await OrderStatus.findOne({ where: { slug: 'paid' } });
    const where: any = {};
    if (paidStatus) {
      where.orderStatusId = { [Op.not]: paidStatus.id };
    }
    return this.paginate(paginateRequest, {
      where,
      include: [
        {model: Client, as: 'client',  attributes: ['id', 'name', 'lastName', 'email']},
        {model: OrderStatus, as: 'status', attributes: ['id', 'name', 'color']},
        {model: OrderItem, as: 'items', attributes: ['id']},
      ],
      order: [['createdAt', 'desc']]
    });
  }

  public byId= async (id: number): Promise<IOrder> => {
    return Order.findByPk(id, {
      include: [
        {model: Client, as: 'client', include: [{model: Address, as: 'address', include: [{model: Province, as: 'province'}]}]},
        {model: OrderStatus, as: 'status', attributes: ['id', 'name', 'slug', 'color']},
        {model: OrderItem, as: 'items'},
      ],
    })
  };
  
  public byClient= async (clientId: number, paginateRequest: any): Promise<any> => {
    return this.paginate(paginateRequest, {
      where: {clientId},
      include: [
        {model: OrderStatus, as: 'status', attributes: ['id', 'name', 'slug', 'color']},
        {model: OrderItem, as: 'items'},
      ],
      order: [['createdAt', 'desc']]
    })
  };
  
  public create = async (data: {clientId: number, orderDate: string, orderStatusId: number, totalAmount?: number, paymentMethodId?: number}, user: any): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
      const orderData: any = {
        clientId: data.clientId,
        orderDate: data.orderDate,
        orderStatusId: 1, // Pendiente
      };
      if (data.totalAmount !== undefined) orderData.totalAmount = data.totalAmount;
      if (data.paymentMethodId !== undefined) orderData.paymentMethodId = data.paymentMethodId;

      const order = await Order.create(orderData, { transaction });
      await transaction.commit();
      return {
        statusMessage: 'success',
        orderId: order.id
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  public resumeOrder = async(id: number): Promise<any> => {
    return this.byId(id);
  }

  public changeStatus = async(data: {id: number, statusId: number}, userId: number): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
      const order = await Order.findByPk(data.id, {transaction});
      if(!order) {
        throw new Error('Orden no encontrada');
      }
      order.orderStatusId = data.statusId;

      await order.save({transaction});

      const status = await OrderStatus.findByPk(data.statusId, {transaction});

      await OrderHistory.create({
        orderId: order.id,
        title: `Cambio de status a ${status.name}`,
        description: 'Se ha cambiado el estado de la orden.',
        color: status.color,
        userId,
      }, {transaction});
      await transaction.commit();

    } catch (error) {
      await transaction.rollback();
      throw new Error('Error al cambiar el status')
    }
    
  }

  public generatePDF = async (id: number): Promise<string> => {
    const order: IOrder = await this.byId(id);
    
    const {name, lastName, email, phone, documentType, document, company} = order.client;
    const {city, address} = order.client.address;
    const {name: province} = order.client.address.province;

    const products = order.items.map((item: any) => ({
      id: item.id,
      name: item.description,
      sku: item.sku,
      price: item.finalPrice,
      quantity: item.quantity,
      total: item.total
    }));
    const orderDate = DateTime.fromISO(order.orderDate.toString()).toFormat('dd/MM/yyyy');
    const data = {
      orderId: id,
      orderDate,
      client: {
        id: order.clientId,
        name: `${name} ${lastName || ''}`,
        company,
        email, phone, documentType, document,
        address: `${address}, ${city}. ${province}`
      },
      products,
      total: order.totalAmount,
    };
    
    const html = await pdfService.getHtmlFromTemplate('order', data);
    return html;
  }

  public async updateOrderTotalAmount(orderId: number) {
    const items = await OrderItem.findAll({ where: { orderId } });
    const totalAmount = items.reduce((acc, item) => acc + (item.total || 0), 0);
    await Order.update({ totalAmount }, { where: { id: orderId } });
    return totalAmount;
  }

    public allPaid = async (paginateRequest: any): Promise<any> => {
    const paidStatus = await OrderStatus.findOne({ where: { slug: 'paid' } });
    if (!paidStatus) return [];
    return this.paginate(paginateRequest, {
      where: { orderStatusId: paidStatus.id },
      include: [
        { model: Client, as: 'client', attributes: ['id', 'name', 'lastName', 'email'] },
        { model: OrderStatus, as: 'status', attributes: ['id', 'name', 'color', 'slug'] },
        { model: OrderItem, as: 'items', attributes: ['id'] },
      ],
      order: [['createdAt', 'desc']]
    });
  }

  public remove = async (id: number): Promise<void> => {
    await Order.destroy({ where: { id } });
}

}

export default new OrderService();