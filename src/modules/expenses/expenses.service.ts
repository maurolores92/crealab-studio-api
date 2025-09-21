
import { CrudService } from '@src/core/helpers';
import { Expenses, IExpenses } from './expenses.model';
import { ExpensesItem } from './items/expensesItem.model';
import { Inventory } from '../inventory/inventory.model';
import { User } from '../users/users.model';

class ExpensesService extends CrudService<IExpenses> {
    constructor() {
        super(Expenses, 'expenses-service');
    }

    public all = async(paginateRequest?: any): Promise<any> => {
        const query: any = {};
        const result = await this.paginate(paginateRequest, {
            where: query,
            order: [['createdAt', 'desc']],
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'lastName', 'email'] },
                { model: User, as: 'performedBy', attributes: ['id', 'name', 'lastName', 'email'] },
                { model: ExpensesItem, as: 'items', attributes: ['id'] }
            ]
        });
        if (result && result.data) {
        result.data = result.data.map((expense: any) => ({
            ...expense.toJSON(),
            itemsCount: expense.items ? expense.items.length : 0
        }));
        }
        return result;
    };

    public allExpenses = async(): Promise<any> => {
        return await Expenses.findAll({
        order: [['createdAt', 'desc']]
        });
    };

    public async updateExpenseTotalAmount(expenseId: number, transaction?: any) {
        const items = await ExpensesItem.findAll({ where: { expenseId }, transaction });
        const amountTotal = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
        await Expenses.update({ amountTotal }, { where: { id: expenseId }, transaction });
        return amountTotal;
    }

    public getExpenseById = async (id: number): Promise<any> => {
        return await Expenses.findByPk(id, {
            include: [
                {
                    model: ExpensesItem,
                    as: 'items',
                    include: [
                        { model: Inventory, as: 'inventory' }
                    ]
                }
            ]
        });
    };

    public getAllByPerformedById = async (performedById: number): Promise<IExpenses[]> => {
        return await Expenses.findAll({
            where: { performedById },
            include: [
                { model: User, as: 'performedBy', attributes: ['id', 'name', 'lastName', 'email'] },
                { model: ExpensesItem, as: 'items' }
            ],
            order: [['date', 'desc']]
        });
    }

    public async getTotalByPerformedByIdFromList(performedById: number): Promise<number> {
        const expenses = await this.getAllByPerformedById(performedById);
        return expenses.reduce((acc, expense) => acc + (Number(expense.amountTotal) || 0), 0);
    }

}

export const expensesService = new ExpensesService();