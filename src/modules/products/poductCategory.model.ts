
import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { Category, ICategory } from './categories/category.model';
import { IProducts, Products } from './products.model';

export interface IProductCategory extends IModelBase {
  id: number;
  categoryId: number;
  productId: number;
  category?: ICategory;
  product?: IProducts;
}

const model = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
 
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Products,
      key: 'id',
    },
  },
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id',
    },
  },
};

const ProductCategory: ModelStatic<IProductCategory> = sequelize.define<IProductCategory>(
  'ProductCategory',
  model,
  configDatabase
);

ProductCategory.belongsTo(Products, { as: 'product', foreignKey: 'productId' });
ProductCategory.belongsTo(Category, { as: 'category', foreignKey: 'categoryId' });

Products.hasMany(ProductCategory, { as: 'categories' });
Category.hasMany(ProductCategory, { as: 'products' });

export { ProductCategory };