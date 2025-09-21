import { difference, isArray } from 'lodash';
import { Op, Transaction } from 'sequelize';
import { CrudService } from '@src/core/helpers';
import { Products, IProducts } from './products.model';
import { ProductInventory } from './inventory/productInventory.model';
import { Inventory } from '../inventory/inventory.model';
import { ProductStatus } from './status/productStatus.model';
import { sequelize } from '@src/core/configurations';
import { StockDistribution } from './stock/stockDistribution.model';
import Context from '@src/core/middleware/context';
import { ProductHistory } from './history/productHistory.model';
import { removeFile, uploadFile } from '@src/core/helpers/filestore/filesystem';
import { Category } from './categories/category.model';
import { ProductGallery } from './gallery/productGallery.model';
import { IProductCategory, ProductCategory } from './poductCategory.model';
import cacheService from '@src/core/cache/memory';

class ProductsService extends CrudService<IProducts> {
  constructor() {
    super(Products, 'products-service');
  }

  public bySku = async(sku: string, user?: any): Promise<IProducts> => {
    const exclude = ['createdAt', 'updatedAt'];
    
    if(!user) {
      exclude.push('price', 'priceBig', 'priceSmall');
    }

    return await Products.findOne({
      where: { sku },
      attributes: { exclude },
      include: [
        {
          model: ProductCategory, 
          as: 'categories', 
          attributes: ['id'], 
          include: [{model: Category, as: 'category', attributes: ['id', 'name']}]},
        {
          model: ProductGallery, 
          as: 'gallery'
        },
      ]
    });
  };

  public actived = async(paginateRequest?: any, user?: any): Promise<any> => {
    const query: any = {};
    const queryCategory: any = {}
    
    if(paginateRequest) {
      if(paginateRequest.category && paginateRequest.category !== '') {
        const category = await Category.findOne({where: {slug: paginateRequest.category}, attributes: ['id']});
        if(!category) {
          return {
            totalPages: 0,
            currentPage: 1,
            totalRecords: 0,
            data:[]
          };
        }
        queryCategory.categoryId = category.id;
      }
    }

    const attributes: string[] = [
      'id', 'name', 'sku', 'description', 'stock', 'productStatusId', 'imageUrl', 'createdAt',
    ];
    
    if(user && user.role.slug === 'client') {
      attributes.push('price', 'priceSmall', 'priceBig');
    }

    return await this.paginate(paginateRequest, {
      where: query,
      attributes,
      include: [
        {
          model: ProductCategory, 
          as: 'categories', 
          attributes: ['id'],  
          where: queryCategory,
          include: [{model: Category, as: 'category', attributes: ['id', 'name']}]
        },
        {model: ProductGallery, as: 'gallery'},
      ],
      order: [['createdAt', 'desc']],
    });
  }

  public all = async(paginateRequest?: any): Promise<any> => {
    const query: any = {};
    if(paginateRequest) {
      if(paginateRequest.name && paginateRequest.name !== '') {
        query.name = { [Op.like]: `%${paginateRequest.name}%` };
      }
      if(paginateRequest.sku && paginateRequest.sku !== '') {
        query.sku = { [Op.like]: `%${paginateRequest.sku}%` };
      }
      if(paginateRequest.categories && paginateRequest.categories.length) {
        const products = await ProductCategory.findAll({where: {categoryId: {[Op.in]: paginateRequest.categories}}, attributes: ['productId']});
        query.id = {[Op.in]: products.map(({productId}: any) => productId)};
      }
    }
    
    return await this.paginate(paginateRequest, {
      where: query,
      attributes: [
        'id', 'name', 'sku', 'description', 'stock', 'price', 'priceFinal', 'productStatusId',  'imageUrl', 'createdAt'
      ],
      include: [
        {
          model: ProductCategory, 
          as: 'categories', 
          attributes: ['id'], 
          include: [
            {
              model: Category, 
              as: 'category', 
              attributes: ['id', 'name']
            }
          ]
        },
        {model: ProductStatus, as: 'status', attributes: ['id', 'name']},
      ],
      order: [['createdAt', 'desc']],
    });
  };

  public similars = async(productId: number, user: any): Promise<IProducts[]> => {
      const currentProduct = await Products.findByPk(productId);
      if(!currentProduct) return [];
      const categories: IProductCategory[] = await ProductCategory.findAll({
        where: {productId},
        attributes: ['categoryId'],
      });
      const categoriesIds: number[] = categories.map((c: IProductCategory) => c.categoryId);
      if(categoriesIds && categoriesIds.length) {
        const attributes: string[] = [
          'id', 'name', 'sku', 'description', 'stock', 'productStatusId', 'imageUrl', 'createdAt'
        ];
        if(user && user.role.slug === 'client') {
          attributes.push('price', 'priceSmall', 'priceBig');
        }
    
        return await Products.findAll({
          where: {productStatusId: 2, id: {[Op.not]: productId}},
          attributes,
          include: [
            {
              model: ProductCategory, 
              as: 'categories', 
              attributes: ['id'],  
              where: {categoryId: {[Op.in]: categoriesIds}},
              include: [{model: Category, as: 'category', attributes: ['id', 'name']}]
            },
            {model: ProductGallery, as: 'gallery'},
          ],
          order: [['createdAt', 'desc']],
          limit: 4
        });
      }

      return [];
  }

  public byId = async(id: number): Promise<IProducts> => {
    const product = await Products.findOne({
      where: { id },
      include: [
        {model: ProductCategory, as: 'categories', attributes: ['id'],  include: [{model: Category, as: 'category', attributes: ['id', 'name']}]},
        {model: ProductStatus, as: 'status'},
        {model: StockDistribution, as: 'stockDistribution'},
        {model: ProductGallery, as: 'gallery'},
        {model: ProductHistory, as: 'history', limit: 3, order: [['createdAt', 'desc']]},
        {model: ProductInventory, as: 'insumos', include: [{model: Inventory, as: 'inventory'}]},
      ]
    });
    return product;
  };

  public uploadMainImage = async(productId: number, file: any): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
      const product = await Products.findByPk(productId);
      if(!product) throw new Error('Producto no encontrado');

      if(file.mainImage) {
        const folder = `/storage/products/${product.id}`;
        await uploadFile(folder, file.mainImage.name, file.mainImage);
        product.imageUrl = `${folder}/${file.mainImage.name}`,
        await product.save({transaction});
        await ProductHistory.create({
          title: 'Imagen Principal Actualizada',
          description: 'La imagen principal se actualizó',
          color: 'success',
          productId: product.id, 
          userId: Context.userId,
        }, {transaction});
  
        await transaction.commit();
      }
      
      return product;
    } catch (error) {
      await transaction.rollback();
      throw(error);
    }
  }

  public deleteMainImage = async(productId: number): Promise<any> => {
    const transaction = await sequelize.transaction();

    try {
      const product = await Products.findByPk(productId);
      if (!product) throw new Error('Producto no encontrado');
    
      if (product.imageUrl) {
        await removeFile(product.imageUrl);
        product.imageUrl = null;
        await product.save({ transaction });

        await ProductHistory.create({
          title: 'Imagen Principal Eliminada',
          description: 'La imagen principal se eliminó',
          color: 'warning',
          productId: product.id,
          userId: Context.userId,
        }, { transaction });  
      }

      await transaction.commit();
      return product;
    } catch (error) {
      await transaction.rollback();
      throw error;
    
    }

  }


  private uploadInGallery = async(file: any, productId: number, transaction: Transaction) => {
    const folder = `/storage/products/${productId}`;
    const ext = file.name.match(/\.([^.]+)$/)[1];
    const photoUrl = `${file.md5}.${ext}`;

    await uploadFile(folder, photoUrl, file);
    
    return await ProductGallery.create({
      link: `${folder}/${file.md5}.${ext}`,
      name: file.name.replace(`.${ext}`, ''),
      type: ext,
      key: file.md5,
      productId, 
    }, {transaction});
  }

  public deleteGalleryImage = async(productId: number, galleryId: number): Promise<any> => {
    const transaction = await sequelize.transaction();
    try { 
      const galleryImage = await ProductGallery.findOne({where: {id: galleryId, productId}});
      if (!galleryImage) throw new Error('Imagen no encontrada');
      await removeFile(galleryImage.link);
      await ProductGallery.destroy({ where: { id: galleryId }, transaction });

      await ProductHistory.create({
        title: 'Imagen de galeria Eliminada',
        description: 'La imagen de galeria se eliminó',
        color: 'warning',
        productId,
        userId: Context.userId,
      }, { transaction });  

      await transaction.commit();
      return true;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }

  public createProduct = async(data: any, files: any): Promise<IProducts> => {
    const transaction = await sequelize.transaction();
    try {
      const status = await ProductStatus.findOne({where: {slug: data.statusSlug}});
      data.productStatusId = status.id;
      data.userId = Context.userId;
      if(!data.categories) {
        throw new Error('Debe seleccionar al menos una categoría');
      }
      // Parsear insumos si vienen como string (FormData)
      if (typeof data.insumos === 'string') {
        try {
          data.insumos = JSON.parse(data.insumos);
        } catch (e) {
          data.insumos = [];
        }
      }
      const product = await Products.create(data, {transaction});
      const categories = data.categories.split(',');
      const categoriesPromises = categories.map((category: any) => 
        ProductCategory.create({productId: product.id, categoryId: category}, {transaction})
      );
      await Promise.all(categoriesPromises);

      await StockDistribution.create({
        productId: product.id, 
        stock: data.stock,
        status: 'current',
      }, {transaction});

      // Procesar insumos: crear en tabla relacional y descontar stock
      if (Array.isArray(data.insumos) && data.insumos.length > 0) {
        for (const insumo of data.insumos) {
          if (insumo.id && insumo.cantidad > 0) {
            await ProductInventory.create({
              productId: product.id,
              inventoryId: insumo.id,
              quantityUsed: insumo.cantidad
            }, { transaction });
            // Descontar stock del inventario
            const inventory = await Inventory.findByPk(insumo.id);
            if (inventory && typeof inventory.stock === 'number') {
              inventory.stock = Math.max(0, inventory.stock - insumo.cantidad);
              await inventory.save({ transaction });
            }
          }
        }
      }

      if(files.mainImage) {
        const folder = `/storage/products/${product.id}`;
        await uploadFile(folder, files.mainImage.name, files.mainImage);
        product.imageUrl = `${folder}/${files.mainImage.name}`,
        await product.save({transaction});
      }
      if(files.gallery ) {
        if(isArray(files.gallery)) {
          const galleryPromise = files.gallery.map(async (file: any) => this.uploadInGallery(file, product.id, transaction));
          await Promise.all(galleryPromise);
        } else {
          await this.uploadInGallery(files.gallery, product.id, transaction);
        }
      }
      await transaction.commit();
      ProductHistory.create({
        title: 'Producto Creado',
        description: 'El producto se creó',
        color: 'success',
        productId: product.id, 
        userId: Context.userId,
      });
      cacheService.delete('categories_products');

      return product;
    } catch (error) {
      console.log('product-service', error);
      await transaction.rollback();
      throw(error);
    }
  };

  public update = async(id: number, newData: any): Promise<any> => {
    const transaction = await sequelize.transaction();
    try {
      const product = await Products.findByPk(id, {
        include: [
          {model: ProductStatus, as: 'status'},
          {model: ProductCategory, as: 'categories', attributes: ['id'], include: [{model: Category, as: 'category', attributes: ['id', 'name']}]},
        ]});
      if(!product) throw new Error('Producto no encontrado');
      if(newData.statusSlug !== product.status.slug) { 
        const status = await ProductStatus.findOne({where: {slug: newData.statusSlug}});
        newData.productStatusId = status.id;
      }
      if(newData.categories) {
        const categories = newData.categories;
        const toRemove = difference(product.categories.map((c: any) => c.category.id), categories);
        const toAdd = difference(categories, product.categories.map((c: any) => c.category.id));
        
        if(toRemove.length > 0) {
          const toRemovePromises = toRemove.map((category: any) => 
            ProductCategory.destroy({where: {productId: product.id, categoryId: category}, transaction})
          );
          await Promise.all(toRemovePromises);
        }
        if(toAdd.length > 0) {
          const toAddPromises = toAdd.map((category: any) => 
            ProductCategory.create({productId: product.id, categoryId: category}, {transaction})
          );
          await Promise.all(toAddPromises);
        }
      }

      // Parsear insumos si vienen como string (FormData)
      if (typeof newData.insumos === 'string') {
        try {
          newData.insumos = JSON.parse(newData.insumos);
        } catch (e) {
          newData.insumos = [];
        }
      }

      newData.updatedAt = new Date();

      await product.update(newData, {transaction});

      // Procesar insumos: crear en tabla relacional y descontar stock
      if (Array.isArray(newData.insumos) && newData.insumos.length > 0) {
        for (const insumo of newData.insumos) {
          if (insumo.id && insumo.cantidad > 0) {
            await ProductInventory.create({
              productId: product.id,
              inventoryId: insumo.id,
              quantityUsed: insumo.cantidad
            }, { transaction });
            // Descontar stock del inventario
            const inventory = await Inventory.findByPk(insumo.id);
            if (inventory && typeof inventory.stock === 'number') {
              inventory.stock = Math.max(0, inventory.stock - insumo.cantidad);
              await inventory.save({ transaction });
            }
          }
        }
      }

      await ProductHistory.create({
        title: 'Producto Actualizado',
        description: 'El producto se actualizó',
        color: 'success',
        productId: product.id, 
        userId: Context.userId,
      }, {transaction});

      await transaction.commit();
      
      return product;
    } catch (error) {
      await transaction.rollback();
      throw(error);
    }
  };

  public addGallery = async(data: any, files: any): Promise<IProducts> => {
    const transaction = await sequelize.transaction();
    try {
      const product = await Products.findOne({where: {id: data.productId}});
      if(!product) throw new Error('Producto no encontrado');
      
      if(files.gallery ) {
        if(isArray(files.gallery)) {
          const galleryPromise = files.gallery.map(async (file: any) => this.uploadInGallery(file, product.id, transaction));
          await Promise.all(galleryPromise);
        } else {
          await this.uploadInGallery(files.gallery, product.id, transaction);
        }
      }
      await transaction.commit();
      ProductHistory.create({
        title: 'Galería Actualizada',
        description: 'Se han agregado imagenes a la galería',
        color: 'success',
        productId: product.id, 
        userId: Context.userId,
      });

      return product;
    } catch (error) {
      await transaction.rollback();
      throw(error);
    }
  
  }
}

export const productsService = new ProductsService();