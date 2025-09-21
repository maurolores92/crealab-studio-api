import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';

interface IInventory extends IModelBase {
  name: string;
  type: string;
  color: string;
  unit: string;
  stock?: number;
  supplier?: string;
  dateLastPurchase?: Date;
  isActive?: boolean;
}

const model = {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  supplier: {
    type: DataTypes.STRING,
    allowNull: true
  },
  dateLastPurchase: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
};

const Inventory: ModelStatic<IInventory> = sequelize.define<IInventory>(
  'Inventory',
  model,
  configDatabase
);

export { Inventory, IInventory };
