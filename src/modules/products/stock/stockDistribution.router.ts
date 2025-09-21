import { CrudRouter } from '@src/core/helpers/database/crud.router';
import { stockDistributionController } from './stockDistribution.controller';
import { IStockDistribution } from './stockDistribution.model';
import { apiTokenValidation } from '@src/core/middleware';
import Context from '@src/core/middleware/context';

class StockDistributionRouter extends CrudRouter<IStockDistribution> {
  constructor() {
    super('/stock', stockDistributionController);
    this.prepareRouters();
    this.initRoutes([]);
  }
  private prepareRouters = (): void => {
    this.router.post('/', [apiTokenValidation, Context.create], stockDistributionController.addStock);
  };
}

export const stockDistributionRouter = new StockDistributionRouter();
