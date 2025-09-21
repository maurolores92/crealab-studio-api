import { CrudController } from '@src/core/helpers';
import { IExpenses } from './expenses.model';
import { expensesService } from './expenses.service';
import { NextFunction } from 'express';

class ExpensesController extends CrudController<IExpenses> {
  constructor() {
    super(expensesService, 'expenses-controller');
  }

  public allExpenses = async(req: any, res: any, next: NextFunction): Promise<void> => {
    try {
      const items = await expensesService.allExpenses();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }

  public getExpenseById = async (req: any, res: any, next: NextFunction): Promise<void> => {
    try {
      const expenseId = Number(req.params.id);
      const expense = await expensesService.getExpenseById(expenseId);
      res.json(expense);
    } catch (error) {
      next(error);
    }
  }
  
  public getAllByPerformedById = async (req: any, res: any, next: NextFunction): Promise<void> => {
    try {
      const performedById = Number(req.params.performedById);
      const expenses = await expensesService.getAllByPerformedById(performedById);
      res.json(expenses);
    } catch (error) {
      next(error);
    }
  }

  public getTotalByPerformedByIdFromList = async (req: any, res: any, next: NextFunction): Promise<void> => {
    try {
      const performedById = Number(req.params.performedById);
      const total = await expensesService.getTotalByPerformedByIdFromList(performedById);
      res.json({ performedById, total });
    } catch (error) {
      next(error);
    }
  }
}

export const expensesController = new ExpensesController();
