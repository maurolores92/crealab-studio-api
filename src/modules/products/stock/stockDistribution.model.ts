import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { Products } from '../products.model';

export interface IStockDistribution extends IModelBase {
  productId: number;
  stock: number;
}

const model = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    default: 0,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true,
    default: 'pending',
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Products,
      key: 'id',
    },
  },
};

const StockDistribution: ModelStatic<IStockDistribution> = sequelize.define<IStockDistribution>(
  'StockDistribution',
  model,
  configDatabase
);


export { StockDistribution };
