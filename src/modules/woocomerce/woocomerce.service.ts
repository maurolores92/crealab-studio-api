import wordpressConnector from '@src/core/connectors/wordpress/wordpress.connector';
import { Products } from '@src/modules/products/products.model';
import { Category } from '../products/categories/category.model';

class WoocommerceService {


	async syncAllProducts() {
		const products = await Products.findAll();
		const results = [];
		const baseUrl = process.env.BASE_IMAGE_URL || 'https://crealabstudio.com.ar';
		const makeAbsoluteUrl = (url: string) => url.startsWith('http') ? url : `${baseUrl}${url}`;
		const cleanText = (txt: any) => (txt === null || txt === undefined || txt === 'null') ? '' : String(txt);
		for (const producto of products) {
			try {
				if (!producto.name || !producto.price) {
					results.push({ id: producto.id, success: false, error: 'Faltan campos requeridos: name o price' });
					continue;
				}

				let images: { src: string }[] = [];
				if (producto.imageUrl) {
					if (Array.isArray(producto.imageUrl)) {
						images = producto.imageUrl.map((url: string) => ({ src: makeAbsoluteUrl(url) }));
					} else {
						images = [{ src: makeAbsoluteUrl(producto.imageUrl) }];
					}
				}

				let categories: { id: number }[] = [];
				if (producto.categories && Array.isArray(producto.categories)) {
					categories = producto.categories.map((cat: any) => ({ id: cat.wooId || cat.id }));
				}
				const wooProduct = {
					name: producto.name,
					type: 'simple',
					regular_price: String(producto.priceFinal || producto.price),
					description: cleanText(producto.description),
					short_description: cleanText(producto.summary),
					sku: producto.sku || undefined,
					stock_quantity: typeof producto.stock === 'number' ? producto.stock : undefined,
					categories,
					manage_stock: true,
					status: 'publish',
				};

				const result = await wordpressConnector.createProduct(wooProduct);
				results.push({ id: producto.id, success: true, wooId: result.id });
			} catch (error) {
				if (error?.response) {
					console.error('Error WooCommerce:', error.response.data);
					results.push({ id: producto.id, success: false, error: error.response.data });
				} else {
					results.push({ id: producto.id, success: false, error: error?.message || error });
				}
			}
		}
		return results;
	}

		async syncAllCategories() {
		const localCategories = await Category.findAll();
		const wooCategories = await wordpressConnector.getCategories({ per_page: 100 });
		const wooSlugs = new Set(wooCategories.map((cat: any) => cat.slug));
		const results = [];
		for (const cat of localCategories) {
			if (!wooSlugs.has(cat.slug)) {
				try {
					const newCat = await wordpressConnector.createCategory({
						name: cat.name,
						slug: cat.slug,
						description: cat.status || '',
					});
					results.push({ name: cat.name, success: true, wooId: newCat.id });
				} catch (error) {
					results.push({ name: cat.name, success: false, error: error?.message || error });
				}
			} else {
				results.push({ name: cat.name, success: true, info: 'Ya existe en WooCommerce' });
			}
		}
		return results;
	}
}

export const woocommerceService = new WoocommerceService();
