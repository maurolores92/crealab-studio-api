import { CrudController } from '@src/core/helpers';
import { orderStatusService } from './orderStatus.service';
import { IOrderStatus } from './orderStatus.model';
import { NextFunction, Response } from 'express';

class OrderStatusController extends CrudController<IOrderStatus> {
  constructor() {
    super(orderStatusService, 'order-status-controller');
  }
  public all = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const status = await orderStatusService.allStatus();
      res.status(200).json(status);
    } catch (error) {
      next(error);
    }
  };
  
}

export const orderStatusController = new OrderStatusController();
