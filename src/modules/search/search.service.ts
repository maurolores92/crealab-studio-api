import { Op } from "sequelize";
import { Category } from "../products/categories/category.model";
import { IProducts, Products } from "../products/products.model";

class SearchService {

  public search = async(text: string): Promise<{products: any[], categories: any[]}> => {
    
    const categories = await Category.findAll({
      where: {name: {[Op.like]: `%${text}%`,}},
      attributes: ['name', 'slug']
    })
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