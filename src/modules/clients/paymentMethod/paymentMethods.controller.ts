
import { CrudController } from '@src/core/helpers';
import { paymentMethodService } from './paymentMethods.service';
import { IPaymentMethod } from './paymentMethods.model';

class PaymentMethodController extends CrudController<IPaymentMethod> {
  constructor() {
    super(paymentMethodService, 'paymentMethods-controller');
  }
}

export const paymentMethodController = new PaymentMethodController();
