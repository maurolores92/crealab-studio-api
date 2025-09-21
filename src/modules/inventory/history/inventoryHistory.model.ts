import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { IUser, User } from '@src/modules/users/users.model';
import { Inventory } from '../inventory.model';

export interface IInventoryHistory extends IModelBase {
  inventoryId: number;
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
  inventoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Inventory,
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

const InventoryHistory: ModelStatic<IInventoryHistory> = sequelize.define<IInventoryHistory>(
  'InventoryHistory',
  model,
  configDatabase
);

InventoryHistory.belongsTo(User, { as: 'user', foreignKey: 'userId' });

export { InventoryHistory };
