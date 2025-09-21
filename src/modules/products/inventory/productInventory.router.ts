import { CrudRouter } from '@src/core/helpers/database/crud.router';
import { productInventoryController } from './productInventory.controller';
import { IProductInventory, ProductInventory } from './productInventory.model';
import { apiTokenValidation } from '@src/core/middleware';
import Context from '@src/core/middleware/context';

class ProductInventoryRouter extends CrudRouter<IProductInventory> {
	constructor() {
		super('/product-inventory', productInventoryController);
		this.prepareRouters();
		this.initRoutes([]);
	}

	private prepareRouters = (): void => {
		this.router.post('/consumption', [apiTokenValidation, Context.create], productInventoryController.addConsumption);
		this.router.get('/product/:productId', [apiTokenValidation], productInventoryController.getConsumptionsByProduct);
		this.router.get('/inventory/:inventoryId', [apiTokenValidation], productInventoryController.getProductsByInventory);
	};
}

export const productInventoryRouter = new ProductInventoryRouter();
