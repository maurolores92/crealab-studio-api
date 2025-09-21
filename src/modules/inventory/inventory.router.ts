import { CrudRouter } from '@src/core/helpers/database/crud.router';
import Context from '@src/core/middleware/context';
import { apiTokenValidation } from '@src/core/middleware';
import { IInventory } from './inventory.model';
import { inventoryController } from './inventory.controller';
import { inventoryHistoryRouter } from './history/inventoryHistory.router';

class InventoryRouter extends CrudRouter<IInventory> {
  constructor() {
    super('/inventory', inventoryController);
    this.router.use(inventoryHistoryRouter.basePath, inventoryHistoryRouter.router);
    this.prepareRouters();
    this.initRoutes([apiTokenValidation, Context.create]);
  }

  private prepareRouters = () => {
    this.router.get('/all', inventoryController.allInventory);
  };
  
}

export const inventoryRouter = new InventoryRouter();
