import { Router } from 'express';
import { dashboardsController } from './dashboards.controller';
import Context from '@src/core/middleware/context';
import { apiTokenValidation } from '@src/core/middleware';

class DashboardsRouter {
    public basePath = '/dashboards';
    public router: Router;

    constructor() {
        this.router = Router();
        this.prepareRouters();
        this.initRoutes([apiTokenValidation, Context.create]);
    }

    private prepareRouters = () => {
        this.router.get('/total-last-30-days', dashboardsController.getExpensesLast30DaysStats);
        this.router.get('/total-sales-last-30-days', dashboardsController.getTotalSalesLast30Days);
        this.router.get('/get-stats', dashboardsController.getStats);
        this.router.get('/monthly-revenue-expense-report', dashboardsController.getMonthlyRevenueExpenseReport);
        this.router.get('/open-orders-stats', dashboardsController.getOpenOrdersStats);
        this.router.get('/earning-reports', dashboardsController.getEarningReports);
        this.router.get('/popular-products', dashboardsController.getPopularProducts);
        this.router.get('/recent-paid-orders', dashboardsController.getRecentPaidOrders);
    };

    private initRoutes(middleware: any[]) {
        this.router.use(...middleware);
    }
}

export const dashboardsRouter = new DashboardsRouter();
