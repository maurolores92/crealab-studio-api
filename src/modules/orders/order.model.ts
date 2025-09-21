import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { OrderStatus } from './status/orderStatus.model';
import { IOrderItem } from './items/orderItem.model';
import { User } from '../users/users.model';
import { OrderHistory } from './history/orderHistory.model';
import { Client, IClient } from '../clients/client.model';
import { PaymentMethod } from '../clients/paymentMethod/paymentMethods.model';

interface IOrder extends IModelBase {
  orderDate: Date;
  orderStatusId: number;
  clientId: number;
  paymentMethodId?: number;
  totalAmount?: number;
  items?: IOrderItem[];
  client?: IClient
}

const model = {
  orderDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.DOUBLE,
    allowNull: true,
    defaultValue: 0,
  },
  clientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Client,
      key: 'id',
    },
  },
  orderStatusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: OrderStatus,
      key: 'id',
    },
  },
  paymentMethodId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: PaymentMethod,
      key: 'id',
    },
  },
};

const Order: ModelStatic<IOrder> = sequelize.define<IOrder>(
  'Order',
  model,
  configDatabase
);

Order.belongsTo(OrderStatus, {as: 'status', foreignKey: 'orderStatusId'});
Order.belongsTo(PaymentMethod, {as: 'paymentMethod', foreignKey: 'paymentMethodId'});
Order.belongsTo(Client, {as: 'client', foreignKey: 'clientId'});
Order.belongsTo(User, {as: 'user', foreignKey: 'userId'});

OrderHistory.belongsTo(Order, {as: 'order', foreignKey: 'orderId'});
Order.hasMany(OrderHistory, {as: 'history'});

export { Order, IOrder };
