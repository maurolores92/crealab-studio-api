import { CrudController } from '@src/core/helpers';
import { orderHistoryService } from './orderHistory.service';
import { IOrderHistory } from './orderHistory.model';
import { NextFunction, Response } from 'express';

class OrderHistoryController extends CrudController<IOrderHistory> {
  constructor() {
    super(orderHistoryService, 'order-history-controller');
  }
  public all = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { orderId } = req.params;
      const history = await orderHistoryService.allHistory({ orderId });
      res.status(200).json(history);
    } catch (error) {
      next(error);
    }
  }
  
}

export const orderHistoryController = new OrderHistoryController();
