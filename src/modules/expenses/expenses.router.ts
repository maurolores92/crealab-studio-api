import { CrudRouter } from '@src/core/helpers/database/crud.router';
import Context from '@src/core/middleware/context';
import { apiTokenValidation } from '@src/core/middleware';
import { IExpenses } from './expenses.model';
import { expensesController } from './expenses.controller';
import { expensesItemRouter } from './items/expensesItem.router';

class ExpensesRouter extends CrudRouter<IExpenses> {
  constructor() {
    super('/expenses', expensesController);
    this.router.use(expensesItemRouter.basePath, expensesItemRouter.router);
    this.prepareRouters();
    this.initRoutes([apiTokenValidation, Context.create]);
  }

  private prepareRouters = () => {
  this.router.get('/all', expensesController.allExpenses);
  this.router.get('/:id', expensesController.getExpenseById);
  this.router.get('/by-user/:performedById', expensesController.getAllByPerformedById);
  this.router.get('/total-by-user/:performedById', expensesController.getTotalByPerformedByIdFromList);
  };
  
}

export const expensesRouter = new ExpensesRouter();
