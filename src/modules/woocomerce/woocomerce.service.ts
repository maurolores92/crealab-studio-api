import wordpressConnector from '@src/core/connectors/wordpress/wordpress.connector';
import { Products } from '@src/modules/products/products.model';

class WoocommerceService {

	async syncAllProducts() {
		const products = await Products.findAll();
		const results = [];
		for (const producto of products) {
			try {
				const wooProduct = {
					name: producto.name,
					type: 'simple',
					regular_price: String(producto.priceFinal || producto.price),
					description: producto.description,
					short_description: producto.summary,
					sku: producto.sku,
					stock_quantity: producto.stock,
					images: producto.imageUrl ? [{ src: producto.imageUrl }] : [],
				};
				const result = await wordpressConnector.createProduct(wooProduct);
				results.push({ id: producto.id, success: true, wooId: result.id });
			} catch (error) {
				results.push({ id: producto.id, success: false, error: error?.message || error });
			}
		}
		return results;
	}
}

export const woocommerceService = new WoocommerceService();
