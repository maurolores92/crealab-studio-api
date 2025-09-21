import { readExcel } from "@src/core/helpers";
import Context from "@src/core/middleware/context";
import { sequelize } from "@src/core/configurations";
import { productsService } from "./products.service";
import { Products } from "./products.model";
import { DateTime } from "luxon";
import { excelService } from "@src/core/helpers/filestore/excel.service";
import { Category, ICategory } from "./categories/category.model";


class ProductExcelService {
  private itemMapper = (item: any) => {
    
    item.companyId = Context.companyId;
    item.userId = Context.userId;
    return {
      name: item.nombre,
      sku: item.sku,
      barcode: item.codigo,
      price: item.precio,
      stock: item.stock,
      cost: item.costo,
      category: {
        name: item.categoria,
        slug: item.categoria_slug,
        companyId: Context.companyId,
        status: 'published',
      },
      status: 'published',
      brand: {
        name: item.marca,
        slug: item.marca_slug,
        companyId: Context.companyId,
        status: 'published',
      },
    }
  }
  public previewProduct = async(item: any) => {
    
    if(item) {
      const transaction = await sequelize.transaction();
      try {
        const category = await Category.findOne({where: {slug: item.category.slug, companyId: Context.companyId}});
        if(category) {
          item.categoryId = category.id;
        } else {
          const categoryCreated = await Category.create(item.category, {transaction});
          item.categoryId = categoryCreated.id;
        }
        await transaction.commit();
       
        return item;
      } catch (error) {
        await transaction.rollback();
        throw error;
      }
    }
  }

  public importExcel = async(file: any): Promise<any> => {
    const result = readExcel.get<any>(file.data, this.itemMapper);
    const productCreatePromises: any[] = [];
    for(let item of result) {
      const productData = await this.previewProduct(item);
      if(productData) {
        const validateProduct = await Products.count({where: {sku: productData.sku, companyId: Context.companyId}});
        if(validateProduct === 0) {
          productCreatePromises.push(productsService.createProduct(productData, {}));
        }
      }
    }
    await Promise.all(productCreatePromises);
    return {success: true, imported: productCreatePromises.length};
  }

  public exportExcel = async(): Promise<any> => {
    const headers = {
      id: 'ID',
      name: 'Nombre',
      summary: 'Descripción',
      category: 'Categoría',
      stock: 'Stock',
      cost: 'Costo',
      price: 'Precio',
      discount: 'Descuento',
      createdAt: 'Fecha'
    };
    const products = await Products.findAll({
      where: {companyId: Context.companyId},
      attributes: [
        'id', 'name', 'summary', 'stock', 'price', 'createdAt'
      ],
      include: [
        {model: Category, as: 'category', attributes: ['id', 'name']},
      ],
    });
    const dataExcel = products.map(product => ({
      id: product.id,
      name: product.name,
      summary: product.summary,
      category: product.categories.map((c: ICategory) => c.name).join(','),
      stock: product.stock,
      price: `$${product.price}`,
      createdAt: DateTime.fromJSDate(product.createdAt).toFormat('yyyy-MM-dd')
    }));
    
    const today = DateTime.now().toFormat('yyyyMMdd-HHmmss');
    const fileName = today;
    const folder = 'storage/products/excel/';

    await excelService.generateAndSave(dataExcel, `${fileName}.xlsx`, headers, folder);
    return {fileName: `${folder}${fileName}`};
  }
}

export const productExcelService = new ProductExcelService();
