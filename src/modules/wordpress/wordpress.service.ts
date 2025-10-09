import wordpressConnector from '@src/core/connectors/wordpress/wordpress.connector';

class WordpressService {


	// --- Productos ---

	/**
	 * Crea un producto en WooCommerce
	 */
	async createProduct(data: any) {
		// Mapeo de campos
		const mapped: any = {};
		if (data.name !== undefined) mapped.name = data.name;
		if (data.slug !== undefined) mapped.slug = data.slug;
		if (data.sku !== undefined) mapped.sku = data.sku;
		if (data.description !== undefined) mapped.description = data.description;
		if (data.summary !== undefined) mapped.short_description = data.summary;
		if (data.price !== undefined) mapped.price = data.price !== null ? String(data.price) : '';
		if (data.priceFinal !== undefined) mapped.regular_price = data.priceFinal !== null ? String(data.priceFinal) : '';
		if (data.stock !== undefined) mapped.stock_quantity = data.stock !== null ? String(data.stock) : '';
		if (data.status !== undefined) mapped.status = data.status;
		if (data.type !== undefined) mapped.type = data.type;
		if (data.categories && Array.isArray(data.categories)) mapped.categories = data.categories.map((c: any) => ({ id: c.id }));
		Object.keys(mapped).forEach(key => {
			if (mapped[key] === undefined || mapped[key] === null) {
				delete mapped[key];
			}
		});
		return wordpressConnector.postProduct(mapped);
	}

	/**
	 * Obtiene productos de WooCommerce (con mapeo de campos)
	 */
	async getProducts(params: any = {}) {
		const products = await wordpressConnector.getProducts(params);
		return products.map((p: any) => ({
			id: p.id,
			name: p.name,
			slug: p.slug,
			sku: p.sku,
			link: p.permalink,
			description: p.description,
			summary: p.short_description || p.shortDescription,
			price: Number(p.price),
			priceFinal: Number(p.regular_price || p.regularPrice),
			stock: p.stock_quantity || p.stockQuantity,
			categories: Array.isArray(p.categories) ? p.categories.map((c: any) => ({ id: c.id, name: c.name })) : [],
			imageUrl: p.images && p.images[0] ? p.images[0].src : null,
			status: p.status,
			type: p.type,
			createdAt: p.date_created || p.dateCreated,
		}));
	}

	/**
	 * Obtiene un producto de WooCommerce por ID (con mapeo de campos)
	 */
	async getProductById(id: number) {
		const p = await wordpressConnector.getProductById(id);
		return {
			id: p.id,
			name: p.name,
			slug: p.slug,
			sku: p.sku,
			link: p.permalink,
			description: p.description,
			summary: p.short_description || p.shortDescription,
			price: Number(p.price),
			priceFinal: Number(p.regular_price || p.regularPrice),
			stock: p.stock_quantity || p.stockQuantity,
			categories: Array.isArray(p.categories) ? p.categories.map((c: any) => ({ id: c.id, name: c.name })) : [],
			imageUrl: p.images && p.images[0] ? p.images[0].src : null,
			images: Array.isArray(p.images)
				? p.images.map((img: any) => ({ id: img.id, src: img.src }))
				: [],
			status: p.status,
			type: p.type,
			createdAt: p.date_created || p.dateCreated,
		};
	}

	/**
	 * Actualiza un producto en WooCommerce
	 */
	async updateProduct(id: number, data: any) {
		const mapped: any = {};
		if (data.name !== undefined) mapped.name = data.name;
		if (data.slug !== undefined) mapped.slug = data.slug;
		if (data.sku !== undefined) mapped.sku = data.sku;
		if (data.description !== undefined) mapped.description = data.description;
		if (data.summary !== undefined) mapped.short_description = data.summary;
		if (data.price !== undefined) mapped.price = data.price !== null ? String(data.price) : '';
		if (data.priceFinal !== undefined) mapped.regular_price = data.priceFinal !== null ? String(data.priceFinal) : '';
		if (data.stock !== undefined) mapped.stock_quantity = data.stock !== null ? String(data.stock) : '';
		if (data.status !== undefined) mapped.status = data.status;
		if (data.type !== undefined) mapped.type = data.type;
		if (data.categories && Array.isArray(data.categories)) mapped.categories = data.categories.map((c: any) => ({ id: c.id }));
		if (data.images && Array.isArray(data.images)) mapped.images = data.images;
		Object.keys(mapped).forEach(key => {
			if (mapped[key] === undefined || mapped[key] === null) {
				delete mapped[key];
			}
		});
		return wordpressConnector.putProduct(id, mapped);
	}

	/**
	 * Elimina un producto en WooCommerce
	 */
	async deleteProduct(id: number) {
		return wordpressConnector.deleteProduct(id);
	}

	/**
	 * Asigna una imagen principal a un producto de WooCommerce
	 */
	async setProductImage(productId: number, imageId: number) {
		return wordpressConnector.setProductImage(productId, imageId);
	}

	// --- Categorías ---

	/**
	 * Obtiene categorías de WooCommerce (requiere JWT)
	 */
	async getCategories(params: any) {
		return wordpressConnector.getWpCategories(params);
	}

	/**
	 * Crea una categoría de producto en WooCommerce
	 */
	async createProductCategory(data: { name: string; slug?: string; parent?: number; description?: string; image?: { id: number } }) {
		return wordpressConnector.createProductCategory(data);
	}

	/**
	 * Actualiza una categoría de producto en WooCommerce
	 */
	async updateProductCategory(id: number, data: { name?: string; slug?: string; parent?: number; description?: string; image?: { id: number } }) {
		return wordpressConnector.updateProductCategory(id, data);
	}

	/**
	 * Elimina una categoría de producto en WooCommerce
	 */
	async deleteProductCategory(id: number) {
		return wordpressConnector.deleteProductCategory(id);
	}
}

export const wordpressService = new WordpressService();
