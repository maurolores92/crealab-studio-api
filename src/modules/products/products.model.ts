import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { IProductStatus, ProductStatus } from './status/productStatus.model';
import { StockDistribution } from './stock/stockDistribution.model';
import { ProductHistory } from './history/productHistory.model';
import { User } from '../users/users.model';
import { ProductGallery } from './gallery/productGallery.model';
import { ICategory } from './categories/category.model';
import { ProductInventory } from './inventory/productInventory.model';

export interface IProducts extends IModelBase {
  id: number;
  name: string;
  sku: string;
  description: string;
  aditionalDescription: string;
  summary?: string;
  price: number;
  priceFinal?: number;
  weight?: number;
  time?: number;
  stock: number;
  deleted: boolean;
  productStatusId: number;
  imageUrl: string;
  userId?: number;
  categories?: ICategory[]
  status?: IProductStatus;
}

const model = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }, 
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  aditionalDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL, 
    allowNull: false,
  },
  priceFinal: {
    type: DataTypes.DECIMAL, 
    allowNull: true,
  },
  weight: {
    type: DataTypes.DECIMAL, 
    allowNull: true,
  },
  time: {
    type: DataTypes.DECIMAL, 
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    default: 0,
  },
  imageUrl: {
    type: DataTypes.TEXT, 
    allowNull: true, 
  },
  deleted: {
    type: DataTypes.BOOLEAN,
    default: false,
    allowNull: true, 
  },
  productStatusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ProductStatus,
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

const Products: ModelStatic<IProducts> = sequelize.define<IProducts>(
  'Products',
  model,
  configDatabase
);

Products.belongsTo(User, { as: 'user', foreignKey: 'userId' });
Products.belongsTo(ProductStatus, { as: 'status', foreignKey: 'productStatusId' });

StockDistribution.belongsTo(Products, { as: 'product', foreignKey: 'productId' });
ProductHistory.belongsTo(Products, { as: 'product', foreignKey: 'productId' });

ProductGallery.belongsTo(Products, { as: 'product', foreignKey: 'productId' });

Products.hasMany(StockDistribution, { as: 'stockDistribution' });
Products.hasMany(ProductHistory, { as: 'history' });
Products.hasMany(ProductGallery, { as: 'gallery' });

ProductInventory.belongsTo(Products, { as: 'product', foreignKey: 'productId' });
Products.hasMany(ProductInventory, { as: 'insumos'});

export { Products };
