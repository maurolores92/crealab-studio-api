import { CrudService } from '@src/core/helpers';
import { PaymentMethod, IPaymentMethod } from './paymentMethods.model';
import { IPaginateRequest } from '@src/core/helpers/database/base.model';

class PaymentMethodService extends CrudService<IPaymentMethod> {
  constructor() {
    super(PaymentMethod, 'paymentMethod-service');
  }

  protected preCreate = async(): Promise<void> => {
  };

  public all = async(paginateRequest: IPaginateRequest): Promise<any> => {
    return await this.paginate(paginateRequest, {
      order: [['createdAt', 'desc']]
    });
  };
}

export const paymentMethodService = new PaymentMethodService();
