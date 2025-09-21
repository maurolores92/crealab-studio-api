import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { Products } from '../products.model';

export interface IProductGallery extends IModelBase {
  productId: number;
  link: string;
  key?: string;
  name?: string;
}

const model = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  link: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  key: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  name: {
    type: DataTypes.STRING,
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
};

const ProductGallery: ModelStatic<IProductGallery> = sequelize.define<IProductGallery>(
  'ProductGallery',
  model,
  configDatabase
);

export { ProductGallery };
