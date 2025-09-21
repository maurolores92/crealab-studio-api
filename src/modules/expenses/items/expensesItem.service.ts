import { CrudService } from '@src/core/helpers';
import { ExpensesItem, IExpensesItem } from './expensesItem.model';
import { Inventory } from '@src/modules/inventory/inventory.model';
import { expensesService } from '../expenses.service';

class ExpensesItemService extends CrudService<IExpensesItem> {
  constructor() {
    super(ExpensesItem, 'expenses-item-service');
  }

  public create = async (data: any, transaction?: any): Promise<IExpensesItem> => {
    try {
      delete data.id;
      const item = await ExpensesItem.create(data, { transaction });
      await expensesService.updateExpenseTotalAmount(item.expenseId, transaction);
      // Sumar cantidad al stock del inventario
      const inventory = await Inventory.findByPk(item.inventoryId, { transaction });
      if (inventory) {
        inventory.stock = (inventory.stock || 0) + item.quantity;
        await inventory.save({ transaction });
      }
      return item;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public override remove = async (id: number, transaction?: any): Promise<any> => {
    const item = await ExpensesItem.findByPk(id);
    if (!item) return;
    const expenseId = item.expenseId;
    // Restar cantidad al stock del inventario
    const inventory = await Inventory.findByPk(item.inventoryId, { transaction });
    if (inventory) {
      inventory.stock = Math.max((inventory.stock || 0) - item.quantity, 0);
      await inventory.save({ transaction });
    }
    await item.destroy({ transaction });
    await expensesService.updateExpenseTotalAmount(expenseId, transaction);
  }
}

export const expensesItemService = new ExpensesItemService();