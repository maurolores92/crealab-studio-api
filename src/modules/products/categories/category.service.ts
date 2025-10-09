
import slugify from 'slugify';
import { wordpressService } from '../../wordpress/wordpress.service';

class CategoryService {
  // Obtener categorías desde WooCommerce
  public getAll = async (paginateRequest: { page: number, pageSize: number }): Promise<any> => {
    const page = Number(paginateRequest.page) || 1;
    const per_page = Number(paginateRequest.pageSize) || 100;
    const categories = await wordpressService.getCategories({ page, per_page });
    return {
      totalPages: 1,
      currentPage: page,
      totalRecords: categories.length,
      data: categories
    };
  };

  // Crear categoría en WooCommerce
  public create = async (data: any): Promise<any> => {
    const payload = {
      name: data.name,
      slug: data.slug || slugify(data.name, { lower: true, replacement: '_' }),
      description: data.description || '',
    };
    return wordpressService.createProductCategory(payload);
  };

  // Editar categoría en WooCommerce
  public update = async (id: number, data: any): Promise<any> => {
    const payload: any = {};
    if (data.name) payload.name = data.name;
    if (data.slug) payload.slug = data.slug;
    if (data.description) payload.description = data.description;
    if (data.parent) payload.parent = data.parent;
    if (data.image) payload.image = data.image;
    return wordpressService.updateProductCategory(id, payload);
  };

  // Eliminar categoría en WooCommerce
  public remove = async (id: number): Promise<any> => {
    return wordpressService.deleteProductCategory(id);
  };
}

export const categoryService = new CategoryService();