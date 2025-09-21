import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';

interface IOrderStatus extends IModelBase {
  name: string;
  slug: string;
  color: string;
  icon?: string;
}

const model = {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  icon: {
    type: DataTypes.STRING,
    allowNull: true,
  },
};

const OrderStatus: ModelStatic<IOrderStatus> = sequelize.define<IOrderStatus>(
  'OrderStatus',
  model,
  configDatabase
);


export { OrderStatus, IOrderStatus };
