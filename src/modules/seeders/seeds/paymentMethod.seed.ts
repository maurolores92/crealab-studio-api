
import { IPaymentMethod, PaymentMethod } from "@src/modules/clients/paymentMethod/paymentMethods.model";
import AbstractSeed from "./abstract.seed";

class PaymentMethodSeed extends AbstractSeed<IPaymentMethod> {
  protected data: any[] = [
    {
      name: 'Efectivo',
      slug: 'cash',
    },
    {
      name: 'Tarjeta de crédito',
      slug: 'credit',
    },
    {
      name: 'Tarjeta de débito',
      slug: 'debit',
    },
    {
      name: 'Transferencia',
      slug: 'transfer',
    },
    {
      name: 'Depósito',
      slug: 'deposit',
    },
  ];

  constructor() {
    super(PaymentMethod, 'PaymentMethodSeed')
  }
}

export default new PaymentMethodSeed();
