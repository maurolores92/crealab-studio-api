import { Op } from "sequelize";

import { IProducts, Products } from "../products/products.model";

class SearchService {

  public search = async(text: string): Promise<{products: any[], categories: any[]}> => {
    
  const categories: any[] = []; // TODO: Implementar búsqueda de categorías en WooCommerce/WordPress
    const products = await Products.findAll({
      where: {name: {[Op.like]: `%${text}%`}},
      attributes: ['name', 'sku']
    });
    const productsMapped = products.map(({name, sku}: IProducts): any => ({name, slug: sku}))
    return {
      products: productsMapped,
      categories
    }
  }
}

export default new SearchService();