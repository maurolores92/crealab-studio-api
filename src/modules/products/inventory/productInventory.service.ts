import { IProductInventory, ProductInventory } from './productInventory.model';
import { CrudService } from '@src/core/helpers';
import { Products } from '../products.model';
import { Inventory } from '../../inventory/inventory.model';
import { InventoryHistory } from '../../inventory/history/inventoryHistory.model';
import Context from '@src/core/middleware/context';

class ProductInventoryService extends CrudService<IProductInventory> {
	constructor() {
		super(ProductInventory, 'product-inventory-service');
	}

		public async addConsumption(data: { productId: number; inventoryId: number; quantityUsed: number }) {
			const product = await Products.findByPk(data.productId);
			const inventory = await Inventory.findByPk(data.inventoryId);
			if (!product || !inventory) throw new Error('Producto o inventario no encontrado');

			const quantity = Number(data.quantityUsed);
			if (typeof inventory.stock !== 'number' || inventory.stock < quantity) {
				throw new Error('Stock insuficiente en inventario');
			}
			inventory.stock -= quantity;
			await inventory.save();

			const consumption = await ProductInventory.create({
				productId: data.productId,
				inventoryId: data.inventoryId,
				quantityUsed: data.quantityUsed,
			});

			await InventoryHistory.create({
				inventoryId: data.inventoryId,
				title: 'Consumo de material',
				description: `Se descontaron ${quantity} unidades por uso en el producto #${data.productId}.`,
				color: 'error',
				userId: Context.userId,
			});

			return consumption;
		}

	public async getConsumptionsByProduct(productId: number) {
		return await ProductInventory.findAll({
			where: { productId },
			include: [Inventory],
		});
	}

	public async getProductsByInventory(inventoryId: number) {
		return await ProductInventory.findAll({
			where: { inventoryId },
			include: [Products],
		});
	}
}

export const productInventoryService = new ProductInventoryService();
