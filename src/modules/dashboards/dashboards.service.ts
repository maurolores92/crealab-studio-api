import { Expenses } from '../expenses/expenses.model';
import { Order } from '../orders/order.model';
import { OrderStatus } from '../orders/status/orderStatus.model';
import { Client } from '../clients/client.model';
import { Inventory } from '../inventory/inventory.model';
import { Op } from 'sequelize';

class DashboardsService {
  
    public async getOpenOrdersStats(): Promise<{ totalAmount: number, totalOrders: number, percentChange: number }> {
    const paidStatus = await OrderStatus.findOne({ where: { slug: 'paid' } });
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(now.getDate() - 30);
    const prevMonth = new Date();
    prevMonth.setDate(now.getDate() - 60);

    const openOrdersLast30 = await Order.findAll({
      where: {
        orderStatusId: { [Op.ne]: paidStatus ? paidStatus.id : null },
        orderDate: { [Op.gte]: lastMonth, [Op.lt]: now }
      }
    });
    const totalOrders = openOrdersLast30.length;
    const totalAmount = openOrdersLast30.reduce((acc, order) => acc + (Number(order.totalAmount) || 0), 0);

    const openOrdersPrev30 = await Order.findAll({
      where: {
        orderStatusId: { [Op.ne]: paidStatus ? paidStatus.id : null },
        orderDate: { [Op.gte]: prevMonth, [Op.lt]: lastMonth }
      }
    });
    const prevTotalOrders = openOrdersPrev30.length;

    let percentChange = 0;
    if (prevTotalOrders > 0) {
      percentChange = ((totalOrders - prevTotalOrders) / prevTotalOrders) * 100;
      percentChange = Math.round(percentChange * 10) / 10;
    }

    return { totalAmount, totalOrders, percentChange };
  }

	public async getStats(): Promise<{ sales: number, customers: number, products: number, expenses: number }> {
		const sales = await this.getTotalSalesLast30Days();
		const customers = await Client.count();
		const products = await Inventory.count();
		const now = new Date();
		const lastMonth = new Date();
		lastMonth.setDate(now.getDate() - 30);
		const expensesList = await Expenses.findAll({
			where: {
				date: { [Op.gte]: lastMonth, [Op.lt]: now }
			}
		});
		const expenses = expensesList.reduce((acc, expense) => acc + (Number(expense.amountTotal) || 0), 0);

		return { sales, customers, products, expenses };
	}

  public async getMonthlyRevenueExpenseReport(months: number = 12): Promise<Array<{ month: string, sales: number, expenses: number }>> {
    const paidStatus = await OrderStatus.findOne({ where: { slug: 'paid' } });
    if (!paidStatus) return [];
    const now = new Date();
    const result: Array<{ month: string, sales: number, expenses: number }> = [];
    for (let i = months - 1; i >= 0; i--) {
      // Calcular inicio y fin del mes
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const monthStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`;

      // Ventas (orders pagados)
      const orders = await Order.findAll({
        where: {
          orderStatusId: paidStatus.id,
          orderDate: { [Op.gte]: start, [Op.lt]: end }
        }
      });
      const sales = orders.reduce((acc, order) => acc + (Number(order.totalAmount) || 0), 0);

      // Gastos
      const expensesList = await Expenses.findAll({
        where: {
          date: { [Op.gte]: start, [Op.lt]: end }
        }
      });
      const expenses = expensesList.reduce((acc, expense) => acc + (Number(expense.amountTotal) || 0), 0);

      result.push({ month: monthStr, sales, expenses });
    }
    return result;
  }

	public async getExpensesLast30DaysStats(): Promise<{ totalLast30Days: number, totalPrev30Days: number, percent: number }> {
		const now = new Date();
		const lastMonth = new Date();
		lastMonth.setDate(now.getDate() - 30);
		const prevMonth = new Date();
		prevMonth.setDate(now.getDate() - 60);

		const expensesLast30 = await Expenses.findAll({
			where: {
				date: { [Op.gte]: lastMonth, [Op.lt]: now }
			}
		});
		const totalLast30Days = expensesLast30.reduce((acc, expense) => acc + (Number(expense.amountTotal) || 0), 0);

		const expensesPrev30 = await Expenses.findAll({
			where: {
				date: { [Op.gte]: prevMonth, [Op.lt]: lastMonth }
			}
		});
		const totalPrev30Days = expensesPrev30.reduce((acc, expense) => acc + (Number(expense.amountTotal) || 0), 0);

		let percent = 0;
		if (totalPrev30Days > 0) {
			percent = (totalLast30Days / totalPrev30Days) * 100;
		}

		return { totalLast30Days, totalPrev30Days, percent };
	}

  public async getTotalSalesLast30Days(): Promise<number> {
    const paidStatus = await OrderStatus.findOne({ where: { slug: 'paid' } });
    if (!paidStatus) return 0;
    const now = new Date();
    const lastMonth = new Date();
    lastMonth.setDate(now.getDate() - 30);
    const orders = await Order.findAll({
      where: {
        orderStatusId: paidStatus.id,
        orderDate: { [Op.gte]: lastMonth, [Op.lt]: now }
      }
    });
    return orders.reduce((acc, order) => acc + (Number(order.totalAmount) || 0), 0);
  }
}

export const dashboardsService = new DashboardsService();
