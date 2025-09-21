import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { Products } from '../products.model';
import { IUser, User } from '@src/modules/users/users.model';

export interface IProductHistory extends IModelBase {
  productId: number;
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
    default: 'primary'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Products,
      key: 'id',
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
};

const ProductHistory: ModelStatic<IProductHistory> = sequelize.define<IProductHistory>(
  'ProductHistory',
  model,
  configDatabase
);

ProductHistory.belongsTo(User, { as: 'user', foreignKey: 'userId' });

export { ProductHistory };
