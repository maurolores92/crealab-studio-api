import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { Order } from '../order.model';
import { Products } from '@src/modules/products/products.model';

interface IOrderItem extends IModelBase {
  orderId: number;
  sku: string;
  description?: string;
  quantity: number;
  discount?: number;
  finalPrice?: number;
  total?: number;
}

const model = {
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Order,
      key: 'id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  discount: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  finalPrice: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
  total: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
};

const OrderItem: ModelStatic<IOrderItem> = sequelize.define<IOrderItem>(
  'OrderItem',
  model,
  configDatabase
);

OrderItem.belongsTo(Order, {as: 'order', foreignKey: 'orderId'});

Order.hasMany(OrderItem, {as: 'items'});

export { OrderItem, IOrderItem };
