
import AbstractSeed from "./abstract.seed";
import { IOrderStatus, OrderStatus } from "@src/modules/orders/status/orderStatus.model";

class OrderStatusSeed extends AbstractSeed<IOrderStatus> {
  protected data: any[] = [
    {
      name: 'Pendiente',
      slug: 'pending',
      color: 'warning',
    },
    {
      name: 'En progreso',
      slug: 'in_progress',
      color: 'primary',
    },
    {
      name: 'Enviada',
      slug: 'sended',
      color: 'primary',
    },
    {
      name: 'Ganada',
      slug: 'win',
      color: 'success',
    },
    {
      name: 'Pagada',
      slug: 'paid',
      color: 'success',
    },
    {
      name: 'Rechazada',
      slug: 'rejected',
      color: 'error',
    },
    {
      name: 'Cancelada',
      slug: 'cancelled',
      color: 'error',
    },
  ];

  constructor() {
    super(OrderStatus, 'OrderStatusSeed')
  }
}

export default new OrderStatusSeed();
