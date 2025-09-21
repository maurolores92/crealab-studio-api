import { CrudRouter } from '@src/core/helpers/database/crud.router';
import { apiTokenValidation } from '@src/core/middleware';
import Context from '@src/core/middleware/context';
import { IExpensesItem } from './expensesItem.model';
import { expensesItemController } from './expensesItem.controller';

class ExpensesItemRouter extends CrudRouter<IExpensesItem> {
  constructor() {
    super('/items', expensesItemController);
    this.initRoutes([apiTokenValidation, Context.create]);
  }
}

export const expensesItemRouter = new ExpensesItemRouter();
