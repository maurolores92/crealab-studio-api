import { Request, Response } from 'express';
import { wordpressService } from './wordpress.service';

class WordpressController {

	async createProductCategory(req: Request, res: Response) {
		try {
			const data = req.body;
			const category = await wordpressService.createProductCategory(data);
			res.json({ success: true, category });
		} catch (error: any) {
			res.status(500).json({ success: false, error: error?.message || error });
		}
	}

	async getProducts(req: Request, res: Response) {
		try {
			const { page = 1, per_page = 20, ...rest } = req.query;
			const products = await wordpressService.getProducts({
				page: Number(page),
				per_page: Number(per_page),
				...rest
			});
			res.json({ success: true, products });
		} catch (error: any) {
			res.status(500).json({ success: false, error: error?.message || error });
		}
	}

}

export const wordpressController = new WordpressController();
