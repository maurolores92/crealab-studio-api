import { Withdrawal, IWithdrawal } from './withdrawal.model';
import { CrudService } from '@src/core/helpers';
import { sequelize } from '@src/core/configurations';
import { User } from '../users/users.model';
import { Op, QueryTypes } from 'sequelize';
import { Order } from '../orders/order.model';
import { OrderStatus } from '../orders/status/orderStatus.model';
import { Expenses } from '../expenses/expenses.model';

class WithdrawalService extends CrudService<IWithdrawal> {

	constructor() {
		super(Withdrawal, 'withdrawal-service');
	}

	public all = async (paginateRequest: any): Promise<any> => {
		return this.paginate(paginateRequest, {
			include: [
				{ model: User, as: 'user', attributes: ['id', 'name', 'lastName', 'email'] },
			],
			order: [['date', 'desc']]
		});
	};

	public byId = async (id: number): Promise<IWithdrawal> => {
		return Withdrawal.findByPk(id, {
			include: [
				{ model: User, as: 'user', attributes: ['id', 'name', 'lastName', 'email'] },
			],
		});
	};

	public byUser = async (userId: number, paginateRequest: any): Promise<any> => {
		return this.paginate(paginateRequest, {
			where: { userId },
			include: [
				{ model: User, as: 'user', attributes: ['id', 'name', 'lastName', 'email'] },
			],
			order: [['date', 'desc']]
		});
	};

	public create = async (data: { userId: number; amount: number; date?: Date; description?: string }, user: any): Promise<any> => {
		const transaction = await sequelize.transaction();
		try {
			const withdrawalData: any = {
				userId: data.userId,
				amount: data.amount,
				date: data.date || new Date(),
				description: data.description || '',
			};
			const withdrawal = await Withdrawal.create(withdrawalData, { transaction });
			await transaction.commit();
			return {
				statusMessage: 'success',
				withdrawalId: withdrawal.id,
			};
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	};

	public async totalWithdrawnByUser(userId: number): Promise<number> {
		const result = await Withdrawal.findAll({
			where: { userId },
			attributes: ['amount'],
		});
		return result.reduce((acc, w) => acc + Number(w.amount), 0);
	}

	public async totalWithdrawn(): Promise<number> {
		const result = await Withdrawal.findAll({ attributes: ['amount'] });
		return result.reduce((acc, w) => acc + Number(w.amount), 0);
	}

    public async getAvailableBalance(): Promise<{ sales: number; expenses: number; withdrawals: number; available: number }> {
		const paidStatus = await OrderStatus.findOne({ where: { slug: 'paid' } });
		let sales = 0;
		if (paidStatus) {
			const orders = await Order.findAll({ where: { orderStatusId: paidStatus.id }, attributes: ['totalAmount'] });
			sales = orders.reduce((acc, o) => acc + Number(o.totalAmount || 0), 0);
		}

		const expensesList = await Expenses.findAll({ attributes: ['amountTotal'] });
		const expenses = expensesList.reduce((acc: number, e: any) => acc + Number(e.amountTotal || 0), 0);

		const withdrawalsList = await Withdrawal.findAll({ attributes: ['amount'] });
		const withdrawals = withdrawalsList.reduce((acc, w) => acc + Number(w.amount || 0), 0);

		const available = sales - expenses - withdrawals;
		return { sales, expenses, withdrawals, available };
	}

    
	public async getUserDebtSummary(): Promise<Array<{ userId: number; name: string; lastName: string; totalSpent: number; totalWithdrawn: number; pendingBalance: number }>> {
		// Obtener todos los usuarios
		const users = await User.findAll({ attributes: ['id', 'name', 'lastName'] });
		// Obtener todos los gastos agrupados por performedById
		const expenses = await Expenses.findAll({
			attributes: [
				'performedById',
				[sequelize.fn('SUM', sequelize.col('amount_total')), 'totalSpent']
			],
			where: { performedById: { [Op.not]: null } },
			group: ['performedById']
		});
		// Obtener todos los retiros agrupados por userId
		const withdrawals = await Withdrawal.findAll({
			attributes: [
				'userId',
				[sequelize.fn('SUM', sequelize.col('amount')), 'totalWithdrawn']
			],
			group: ['userId']
		});
		// Mapear por usuario
		return users.map(user => {
			const spent = expenses.find((e: any) => Number(e.performedById) === user.id);
			const withdrawn = withdrawals.find((w: any) => Number(w.userId) === user.id);
			const totalSpent = spent && spent.get('totalSpent') ? Number(spent.get('totalSpent')) : 0;
			const totalWithdrawn = withdrawn && withdrawn.get('totalWithdrawn') ? Number(withdrawn.get('totalWithdrawn')) : 0;
			const pendingBalance = totalSpent - totalWithdrawn;
			return {
				userId: user.id,
				name: user.name,
				lastName: user.lastName,
				totalSpent,
				totalWithdrawn,
				pendingBalance,
			};
		});
	}
}

export default new WithdrawalService();
