import { Request, Response } from 'express';
import { woocommerceService } from './woocomerce.service';

class WoocommerceController {

	async syncAllProducts(req: Request, res: Response) {
		const results = await woocommerceService.syncAllProducts();
		res.json({ success: true, results });
	}
}

export const woocommerceController = new WoocommerceController();
