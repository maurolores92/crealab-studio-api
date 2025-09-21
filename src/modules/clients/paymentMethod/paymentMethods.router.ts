import { CrudRouter } from '@src/core/helpers/database/crud.router';
import Context from '@src/core/middleware/context';
import { IPaymentMethod } from './paymentMethods.model';
import { paymentMethodController } from './paymentMethods.controller';
import { apiTokenValidation } from '@src/core/middleware';

class PaymentMethodRouter extends CrudRouter<IPaymentMethod> {
  constructor() {
    super('/paymentMethod', paymentMethodController);
    this.initRoutes([apiTokenValidation, Context.create]);
  }
}

export const paymentMethodRouter = new PaymentMethodRouter();
