import { CrudService } from '@src/core/helpers';
import { IInventoryHistory, InventoryHistory } from './inventoryHistory.model';

class InventoryHistoryService extends CrudService<IInventoryHistory> {
  constructor() {
    super(InventoryHistory, 'inventory-history-service');
  }

  public historyByInventory = async(inventoryId: string): Promise<IInventoryHistory[]> => {
    return InventoryHistory.findAll({ where: { inventoryId }, order: [['createdAt', 'desc']] });
  }
}

export const inventoryHistoryService = new InventoryHistoryService();