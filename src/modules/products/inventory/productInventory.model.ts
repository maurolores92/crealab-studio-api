import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { Products } from '../products.model';
import { Inventory } from '../../inventory/inventory.model';

export interface IProductInventory extends IModelBase {
  productId: number;
  inventoryId: number;
  quantityUsed: number;
}

const model = {
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Products,
      key: 'id',
    },
  },
  inventoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Inventory,
      key: 'id',
    },
  },
  quantityUsed: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    defaultValue: 0,
  },
};

const ProductInventory: ModelStatic<IProductInventory> = sequelize.define<IProductInventory>(
  'ProductInventory',
  model,
  configDatabase
);

ProductInventory.belongsTo(Inventory, { as: 'inventory', foreignKey: 'inventoryId' });

export { ProductInventory };
