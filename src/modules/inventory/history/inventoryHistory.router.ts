import { CrudRouter } from '@src/core/helpers/database/crud.router';
import Context from '@src/core/middleware/context';
import { apiTokenValidation } from '@src/core/middleware';
import { inventoryHistoryController } from './inventoryHistory.controller';
import { IInventoryHistory } from './inventoryHistory.model';

class InventoryHistoryRouter extends CrudRouter<IInventoryHistory> {
  constructor() {
    super('/history', inventoryHistoryController);
    this.prepareRoutes();
    this.initRoutes([apiTokenValidation, Context.create]);
  }
  private prepareRoutes = () => {
    this.router.get('/:inventoryId', inventoryHistoryController.historyByInventory);
  
  }
}

export const inventoryHistoryRouter = new InventoryHistoryRouter();
