import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { IUser, User } from '@src/modules/users/users.model';
import { Order } from '../order.model';

export interface IOrderHistory extends IModelBase {
  orderId: number;
  title: string;
  description?: string;
  color?: string;
  userId: number;
  user?: IUser;
}

const model = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'primary'
  },
  description: {
    type: DataTypes.TEXT,
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
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: User,
      key: 'id',
    },
  },
};

const OrderHistory: ModelStatic<IOrderHistory> = sequelize.define<IOrderHistory>(
  'OrderHistory',
  model,
  configDatabase
);

OrderHistory.belongsTo(User, { as: 'user', foreignKey: 'userId' });


export { OrderHistory };
