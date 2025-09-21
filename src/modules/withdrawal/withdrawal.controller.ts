import { NextFunction, Response } from 'express';
import withdrawalService from './withdrawal.service';
import { CrudController } from '@src/core/helpers';
import { IWithdrawal } from './withdrawal.model';
import { HttpException } from '@src/core/exceptions';

class WithdrawalController extends CrudController<IWithdrawal> {
	constructor() {
		super(withdrawalService, 'withdrawal-controller');
	}

	public balance = async (req: any, res: Response, next: NextFunction): Promise<void> => {
		try {
			const result = await withdrawalService.getAvailableBalance();
			res.json(result);
		} catch (error) {
			next(error);
		}
	};


	public byUser = async (req: any, res: Response, next: NextFunction): Promise<void> => {
		try {
			const withdrawals = await withdrawalService.byUser(req.params.userId, req.query);
			res.json(withdrawals);
		} catch (error) {
			next(error);
		}
	};

	public create = async (req: any, res: Response, next: NextFunction): Promise<void> => {
		try {
			if (!req.user) {
				throw new HttpException('Debe estar autenticado para registrar un retiro', 401);
			}
			const withdrawal = await withdrawalService.create(req.body, req.user);
			res.json(withdrawal);
		} catch (error) {
			next(error);
		}
	};

	public totalWithdrawnByUser = async (req: any, res: Response, next: NextFunction): Promise<void> => {
		try {
			const total = await withdrawalService.totalWithdrawnByUser(Number(req.params.userId));
			res.json({ userId: req.params.userId, total });
		} catch (error) {
			next(error);
		}
	};

	public totalWithdrawn = async (req: any, res: Response, next: NextFunction): Promise<void> => {
		try {
			const total = await withdrawalService.totalWithdrawn();
			res.json({ total });
		} catch (error) {
			next(error);
		}
	};

    public userDebtSummary = async (req: any, res: Response, next: NextFunction): Promise<void> => {
		try {
			const summary = await withdrawalService.getUserDebtSummary();
			res.json(summary);
		} catch (error) {
			next(error);
		}
	};
}

export default new WithdrawalController();


