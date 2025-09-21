import { CrudController } from '@src/core/helpers';
import { IInventory } from './inventory.model';
import { inventoryService } from './inventory.service';
import { NextFunction, Response } from 'express';


class InventoryController extends CrudController<IInventory> {
  constructor() {
    super(inventoryService, 'products-controller');
  }

  public allInventory = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const items = await inventoryService.allInventory();
      res.json(items);
    } catch (error) {
      next(error);
    }
  }
}

export const inventoryController = new InventoryController();
