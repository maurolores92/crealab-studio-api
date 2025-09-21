import { CrudController } from '@src/core/helpers';
import { IProductInventory, ProductInventory } from './productInventory.model';
import { productInventoryService } from './productInventory.service';
import { Request, Response, NextFunction } from 'express';

class ProductInventoryController extends CrudController<IProductInventory> {
	constructor() {
		super(productInventoryService, 'product-inventory-controller');
	}

		public addConsumption = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
			try {
				console.log('REQ BODY CONSUMO:', req.body);
				const result = await productInventoryService.addConsumption(req.body);
				res.status(201).json(result);
			} catch (error) {
				next(error);
			}
		};

	public getConsumptionsByProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const result = await productInventoryService.getConsumptionsByProduct(Number(req.params.productId));
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	};

	public getProductsByInventory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const result = await productInventoryService.getProductsByInventory(Number(req.params.inventoryId));
			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	};
}

export const productInventoryController = new ProductInventoryController();
