import path from 'path';
import wordpressConnector from '@src/core/connectors/wordpress/wordpress.connector';
import { wordpressService } from '../wordpress/wordpress.service';

class ProductsService  {

  public async uploadAndAddProductGalleryImage(productId: number, file: any): Promise<any> {
    const filePath = file.tempFilePath || file.path;
    const fileName = file.name || file.originalname || (filePath ? path.basename(filePath) : undefined);
    let image: any;
    if (filePath) {
      image = await wordpressConnector.uploadImage(filePath, fileName);
    } else if (file.data) {
      image = await wordpressConnector.uploadImage(file.data, fileName);
    } else {
      throw new Error('No filePath or data buffer found in uploaded file!');
    }
    if (!image || !image.id) {
      throw new Error('La imagen subida no tiene un id válido');
    }
  const wpProduct = await wordpressService.getProductById(productId);
    const currentImages = Array.isArray(wpProduct.images) ? wpProduct.images.map((img: any) => ({ id: img.id })) : [];
    const updatedImages = [...currentImages, { id: image.id }];
  const updatedProduct = await wordpressService.updateProduct(productId, { images: updatedImages });
    return updatedProduct;
  }

  createWpProduct = async (data: any) => {
    return wordpressService.createProduct(data);
  }

  public getAllFromWordpress = async (paginateRequest: { page: number, pageSize: number, name?: string, sku?: string, categoryId?: number | string }): Promise<any> => {
    const page = Number(paginateRequest.page) || 1;
    const per_page = Number(paginateRequest.pageSize) || 100;
    const params: any = { page, per_page };
    if (paginateRequest.name) params.search = paginateRequest.name;
    if (paginateRequest.sku) params.sku = paginateRequest.sku;
    if (paginateRequest.categoryId && paginateRequest.categoryId !== '0') params.category = paginateRequest.categoryId;
    let products = await wordpressService.getProducts(params);

    if (paginateRequest.name) {
      const nameLower = paginateRequest.name.toLowerCase();
      products = products.filter((p: any) => p.name && p.name.toLowerCase().includes(nameLower));
    }

    if (paginateRequest.sku) {
      products = products.filter((p: any) => p.sku && p.sku === paginateRequest.sku);
    }

    if (paginateRequest.categoryId && paginateRequest.categoryId !== '0') {
      products = products.filter((p: any) => Array.isArray(p.categories) && p.categories.some((c: any) => c.id == paginateRequest.categoryId));
    }
    return {
      totalPages: 1,
      currentPage: page,
      totalRecords: products.length,
      data: products
    };
  };

  public getWpProductById = async (id: number): Promise<any> => {
    return wordpressService.getProductById(id);
  }

  public updateWpProduct = async (id: number, data: any): Promise<any> => {
    return wordpressService.updateProduct(id, data);
  }

  public deleteFromWordpress = async (id: number): Promise<any> => {
    return wordpressService.deleteProduct(id);
  }

  public async uploadAndSetProductImage(productId: number, file: any): Promise<any> {
    const filePath = file.tempFilePath || file.path;
    const fileName = file.name || file.originalname || (filePath ? path.basename(filePath) : undefined);
    let image: any;
    if (filePath) {
      image = await wordpressConnector.uploadImage(filePath, fileName);
    } else if (file.data) {
      image = await wordpressConnector.uploadImage(file.data, fileName);
    } else {
      throw new Error('No filePath or data buffer found in uploaded file!');
    }
    if (!image || !image.id) {
      throw new Error('La imagen subida no tiene un id válido');
    }
    const updatedProduct = await wordpressConnector.setProductImage(productId, image.id);
    return updatedProduct;
}

}

export const productsService = new ProductsService();