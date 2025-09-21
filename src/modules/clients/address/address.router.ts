import { CrudRouter } from '@src/core/helpers/database/crud.router';
import Context from '@src/core/middleware/context';
import { IAddress } from './address.model';
import addressController from './address.controller';

class AddressRouter extends CrudRouter<IAddress> {
  constructor() {
    super('/address', addressController);
    this.otherRoute();
    this.initRoutes([Context.create]);
  }
  private otherRoute() {
    this.router.get('/provinces', addressController.getProvinces);
  }
}

export const addressRouter = new AddressRouter();
