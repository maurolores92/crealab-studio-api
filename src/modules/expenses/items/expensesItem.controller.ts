import { CrudController } from '@src/core/helpers';
import { IExpensesItem } from './expensesItem.model';
import { expensesItemService } from './expensesItem.service';

class ExpensesItemController extends CrudController<IExpensesItem> {
  constructor() {
    super(expensesItemService, 'expenses-item-controller');
  }
}

export const expensesItemController = new ExpensesItemController();
