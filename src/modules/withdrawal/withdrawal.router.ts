import withdrawalController from './withdrawal.controller';
import { CrudRouter } from '@src/core/helpers/database/crud.router';
import { IWithdrawal } from './withdrawal.model';
import { apiTokenValidation } from '@src/core/middleware';
import { optionalTokenValidation } from '@src/core/middleware/optionalToken.middleware';
import Context from '@src/core/middleware/context';

class WithdrawalRouter extends CrudRouter<IWithdrawal> {
  constructor() {
    super('/withdrawals', withdrawalController);
    this.prepareRouters();
    this.initRoutes([apiTokenValidation, Context.create]);
  }
  private prepareRouters = () => {
    this.router.post('/', [optionalTokenValidation], withdrawalController.create);
    this.router.get('/byUser/:userId', [apiTokenValidation], withdrawalController.byUser);
    this.router.get('/total/byUser/:userId', [apiTokenValidation], withdrawalController.totalWithdrawnByUser);
    this.router.get('/total', [apiTokenValidation], withdrawalController.totalWithdrawn);
    this.router.get('/balance', [apiTokenValidation], withdrawalController.balance);
    this.router.get('/user-debt-summary', [apiTokenValidation], withdrawalController.userDebtSummary);
  };
}

export const withdrawalRouter = new WithdrawalRouter();

