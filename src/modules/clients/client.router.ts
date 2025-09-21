import { CrudRouter } from '@src/core/helpers/database/crud.router';
import Context from '@src/core/middleware/context';
import { clientsController } from './client.controller';
import { IClient } from './client.model';
import { apiTokenValidation } from '@src/core/middleware';
import { addressRouter } from './address/address.router';

class ClientsRouter extends CrudRouter<IClient> {
  constructor() {
    super('/client', clientsController);
    this.router.use(addressRouter.basePath, addressRouter.router);
    this.prepareRouters();
    this.initRoutes([apiTokenValidation, Context.create]);
  }
  private prepareRouters = () => {
    
  };
}

export const clientsRouter = new ClientsRouter();
