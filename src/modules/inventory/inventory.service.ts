
import { CrudService } from '@src/core/helpers';
import { inventoryHistoryService } from './history/inventoryHistory.service';
import { IInventory, Inventory } from './inventory.model';

class InventoryService extends CrudService<IInventory> {
  constructor() {
    super(Inventory, 'inventory-service');
  }

  public create = async (data: any, user: any) => {
    const inventory = await Inventory.create(data);
    await inventoryHistoryService.create({
      inventoryId: inventory.id,
      title: 'Creación de inventario',
      description: `Inventario creado: ${inventory.name} (${inventory.type})`,
      color: 'success',
      userId: user?.id || null
    });
    return inventory;
  }

    public update = async (id: number, newData: any, user: any) => {
    const inventory = await Inventory.findByPk(id);
    const prevStock = inventory?.stock;
    inventory.set(newData);
    await inventory.save();
    await inventoryHistoryService.create({
      inventoryId: inventory.id,
      title: 'Edición de inventario',
      description: `Inventario editado: ${inventory.name} (${inventory.type}). Stock: ${prevStock} → ${newData.stock}`,
      color: 'info',
      userId: user?.id || null
    });
    return inventory;
  }

  public remove = async (id: number, user?: any) => {
    const inventory = await Inventory.findByPk(id);
    await inventoryHistoryService.create({
      inventoryId: inventory.id,
      title: 'Eliminación de inventario',
      description: `Inventario eliminado: ${inventory.name} (${inventory.type})`,
      color: 'error',
      userId: user?.id || null
    });
    await inventoryHistoryService.model.destroy({ where: { inventoryId: inventory.id } });
    await inventory.destroy();
    return true;
  }

  public all = async(paginateRequest?: any): Promise<any> => {
    const query: any = {};
    if(paginateRequest) {
      if(paginateRequest.name && paginateRequest.name !== '') {
        query.name = paginateRequest.name;
      }
    }
    return await this.paginate(paginateRequest, {
      where: query,
      order: [['name', 'asc']],
    });
  };

  public allInventory = async(): Promise<any> => {
    return await Inventory.findAll({
      order: [['name', 'asc']]
    });
  };
}

export const inventoryService = new InventoryService();