import { CrudController } from '@src/core/helpers';
import { inventoryHistoryService } from './inventoryHistory.service';
import { IInventoryHistory } from './inventoryHistory.model';
import { NextFunction, Response } from 'express';

class InventoryHistoryController extends CrudController<IInventoryHistory> {
  constructor() {
    super(inventoryHistoryService, 'inventory-history-controller');
  }

  public historyByInventory = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { inventoryId } = req.params;
      const history = await inventoryHistoryService.historyByInventory(inventoryId);
      res.status(200).json(history);
    } catch (error) {
      next(error);
    }
  }
}

export const inventoryHistoryController = new InventoryHistoryController();
