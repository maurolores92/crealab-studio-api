import { DataTypes, ModelStatic } from 'sequelize';
import { sequelize } from '@src/core/configurations';
import { IModelBase, configDatabase } from '@src/core/helpers/database/base.model';
import { Expenses } from '../expenses.model';
import { Inventory } from '@src/modules/inventory/inventory.model';

interface IExpensesItem extends IModelBase {
  expenseId: number;
  inventoryId: number;
  quantity: number;
  unitPrice: number;
}

const model = {
  expenseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Expenses,
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
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.DOUBLE,
    allowNull: true,
  },
};

const ExpensesItem: ModelStatic<IExpensesItem> = sequelize.define<IExpensesItem>(
  'ExpensesItem',
  model,
  configDatabase
);


ExpensesItem.belongsTo(Expenses, {as: 'expenses', foreignKey: 'expenseId'});
ExpensesItem.belongsTo(Inventory, {as: 'inventory', foreignKey: 'inventoryId'});

Expenses.hasMany(ExpensesItem, {as: 'items'});

export { ExpensesItem, IExpensesItem };
