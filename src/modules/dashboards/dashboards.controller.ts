import { dashboardsService } from './dashboards.service';
import { NextFunction, Request, Response } from 'express';

class DashboardsController {
    
    public getOpenOrdersStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const stats = await dashboardsService.getOpenOrdersStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    public getStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const stats = await dashboardsService.getStats();
            res.json(stats);
        } catch (error) {
            next(error);
        }
    }

    public getTotalSalesLast30Days = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const total = await dashboardsService.getTotalSalesLast30Days();
            res.json({ total });
        } catch (error) {
            next(error);
        }
    }

    public getExpensesLast30DaysStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const total = await dashboardsService.getExpensesLast30DaysStats();
            res.json({ total });
        } catch (error) {
            next(error);
        }
    }

        public getMonthlyRevenueExpenseReport = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            try {
                const months = req.query.months ? Number(req.query.months) : 12;
                const report = await dashboardsService.getMonthlyRevenueExpenseReport(months);
                res.json(report);
            } catch (error) {
                next(error);
            }
        }
}

export const dashboardsController = new DashboardsController();
