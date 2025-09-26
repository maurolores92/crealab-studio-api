import { Expenses } from '../expenses/expenses.model';
import { Order } from '../orders/order.model';
import { OrderStatus } from '../orders/status/orderStatus.model';
import { OrderItem } from '../orders/items/orderItem.model';
import { Products } from '../products/products.model';
import { Client } from '../clients/client.model';
import { Inventory } from '../inventory/inventory.model';
import { Op, QueryTypes } from 'sequelize';
import { sequelize } from '@src/core/configurations';

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

  // Helper method to calculate trend
  private calculateTrend(current: number, previous: number, isExpense: boolean = false): { trendNumber: number, trend: 'positive' | 'negative' } {
    let trendNumber = 0;
    let trend: 'positive' | 'negative' = 'positive';
    
    if (previous > 0) {
      trendNumber = ((current - previous) / previous) * 100;
      // For expenses: positive change = bad (negative trend), negative change = good (positive trend)
      if (isExpense) {
        trend = trendNumber >= 0 ? 'negative' : 'positive';
      } else {
        trend = trendNumber >= 0 ? 'positive' : 'negative';
      }
      trendNumber = Math.abs(Math.round(trendNumber * 10) / 10);
    }
    
    return { trendNumber, trend };
  }

  // Helper method to get sales data for a period
  private async getSalesForPeriod(startDate: Date, endDate: Date) {
    const paidStatus = await OrderStatus.findOne({ where: { slug: 'paid' } });
    if (!paidStatus) return { total: 0, count: 0 };
    
    const orders = await Order.findAll({
      where: {
        orderStatusId: paidStatus.id,
        orderDate: { [Op.gte]: startDate, [Op.lt]: endDate }
      }
    });
    
    return {
      total: orders.reduce((acc, order) => acc + (Number(order.totalAmount) || 0), 0),
      count: orders.length
    };
  }

  // Helper method to get weekly profit data
  private async getWeeklyData(): Promise<number[]> {
    const weeklyData: number[] = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setDate(now.getDate() - i);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(now);
      dayEnd.setDate(now.getDate() - i);
      dayEnd.setHours(23, 59, 59, 999);

      // Get sales for the day
      const salesData = await this.getSalesForPeriod(dayStart, new Date(dayEnd.getTime() + 1));
      
      // Get expenses for the day
      const dayExpenses = await Expenses.findAll({
        where: {
          date: { [Op.gte]: dayStart, [Op.lte]: dayEnd }
        }
      });
      const dayExpense = dayExpenses.reduce((acc, expense) => acc + (Number(expense.amountTotal) || 0), 0);
      
      const dayProfit = salesData.total - dayExpense;
      weeklyData.push(Math.max(0, Math.round(dayProfit)));
    }
    
    return weeklyData;
  }

  public async getEarningReports(): Promise<{
    netProfit: { amount: number, trendNumber: number, salesCount: number, trend: 'positive' | 'negative' },
    totalIncome: { amount: number, trendNumber: number, trend: 'positive' | 'negative' },
    totalExpenses: { amount: number, trendNumber: number, trend: 'positive' | 'negative' },
    weeklyData: number[]
  }> {
    // Define date ranges
    const now = new Date();
    const last30Days = new Date();
    last30Days.setDate(now.getDate() - 30);
    const prev30Days = new Date();
    prev30Days.setDate(now.getDate() - 60);

    // Get income data using existing methods and helper
    const currentSales = await this.getSalesForPeriod(last30Days, now);
    const previousSales = await this.getSalesForPeriod(prev30Days, last30Days);
    const incomeTrend = this.calculateTrend(currentSales.total, previousSales.total);

    // Get expenses data using existing method
    const expensesStats = await this.getExpensesLast30DaysStats();
    const expensesTrend = this.calculateTrend(expensesStats.totalLast30Days, expensesStats.totalPrev30Days, true);

    // Calculate net profit
    const netProfitCurrent = currentSales.total - expensesStats.totalLast30Days;
    const netProfitPrevious = previousSales.total - expensesStats.totalPrev30Days;
    const netProfitTrend = this.calculateTrend(netProfitCurrent, netProfitPrevious);

    // Get weekly data
    const weeklyData = await this.getWeeklyData();

    return {
      netProfit: {
        amount: Math.round(netProfitCurrent * 100) / 100,
        trendNumber: netProfitTrend.trendNumber,
        salesCount: currentSales.count,
        trend: netProfitTrend.trend
      },
      totalIncome: {
        amount: Math.round(currentSales.total * 100) / 100,
        trendNumber: incomeTrend.trendNumber,
        trend: incomeTrend.trend
      },
      totalExpenses: {
        amount: Math.round(expensesStats.totalLast30Days * 100) / 100,
        trendNumber: expensesTrend.trendNumber,
        trend: expensesTrend.trend
      },
      weeklyData
    };
  }

  public async getPopularProducts(limit: number = 6): Promise<{
    products: Array<{
      id: number;
      name: string;
      code: string;
      price: number;
      totalSold: number;
      totalRevenue: number;
      image?: string;
    }>;
    totalVisitors: number;
  }> {
    try {
      console.log('Starting getPopularProducts...');
      
      const paidStatus = await OrderStatus.findOne({ where: { slug: 'paid' } });
      if (!paidStatus) {
        console.log('No paid status found');
        return { products: [], totalVisitors: 0 };
      }
      console.log('Paid status found:', paidStatus.id);

      // Simple approach: get all paid orders with their items
      const paidOrders = await Order.findAll({
        where: { orderStatusId: paidStatus.id },
        include: [{
          model: OrderItem,
          as: 'items',
          where: { productId: { [Op.ne]: null } },
          required: false
        }],
        limit: 100 // Limit orders to avoid performance issues
      });

      console.log('Paid orders found:', paidOrders.length);

      // Aggregate products manually
      const productStats: { [key: number]: { totalSold: number, totalRevenue: number } } = {};

      paidOrders.forEach(order => {
        if (order.items) {
          order.items.forEach(item => {
            if (item.productId) {
              if (!productStats[item.productId]) {
                productStats[item.productId] = { totalSold: 0, totalRevenue: 0 };
              }
              productStats[item.productId].totalSold += item.quantity;
              productStats[item.productId].totalRevenue += (item.total || 0);
            }
          });
        }
      });

      console.log('Product stats:', productStats);

      // Sort by totalSold and get top products
      const sortedProducts = Object.entries(productStats)
        .sort(([, a], [, b]) => b.totalSold - a.totalSold)
        .slice(0, limit);

      console.log('Sorted products (top):', sortedProducts);

      // Get product details
      const productsWithDetails = await Promise.all(
        sortedProducts.map(async ([productId, stats]) => {
          const product = await Products.findByPk(parseInt(productId), {
            attributes: ['id', 'name', 'sku', 'price', 'priceFinal', 'imageUrl']
          });

          if (!product) {
            console.log(`Product not found for ID: ${productId}`);
            return null;
          }

          return {
            id: product.id,
            name: product.name,
            code: product.sku,
            price: Number(product.priceFinal || product.price),
            totalSold: stats.totalSold,
            totalRevenue: Math.round(stats.totalRevenue),
            image: product.imageUrl || undefined
          };
        })
      );

      const validProducts = productsWithDetails.filter((p): p is NonNullable<typeof p> => p !== null);
      const totalVisitors = validProducts.reduce((acc: number, product) => acc + product.totalSold, 0);

      console.log('Final valid products:', validProducts);
      console.log('Total visitors:', totalVisitors);

      return {
        products: validProducts,
        totalVisitors
      };
    } catch (error) {
      console.error('Error in getPopularProducts:', error);
      return { products: [], totalVisitors: 0 };
    }
  }
}

export const dashboardsService = new DashboardsService();
