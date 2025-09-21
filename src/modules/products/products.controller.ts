import { CrudController } from '@src/core/helpers';
import { IProducts } from './products.model';
import { productsService } from './products.service';
import { Response, NextFunction } from 'express';
import { productExcelService } from './productExcel.service';
import { excelService } from '@src/core/helpers/filestore/excel.service';
import { ApiResponse } from '@src/core/interfaces';

class ProductsController extends CrudController<IProducts> {
  constructor() {
    super(productsService, 'products-controller');
  }

  public bySku = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await productsService.bySku(req.params.sku, req.user);
      const apiResponse: ApiResponse<any> = {
              statusCode: 200,
              statusMessage: 'Success',
              data: result,
            };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  };
  public similars = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await productsService.similars(req.params.id, req.user);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  public create = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files;
      const result = await productsService.createProduct(req.body, files);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
  public addGallery = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const files = req.files;
      const result = await productsService.addGallery(req.body, files);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  public importExcel = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { file } = req.files;
      const result = await productExcelService.importExcel(file);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public exportExcel = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await productExcelService.exportExcel();
      excelService.toResponse(res, `${result.fileName}.xlsx`);
    } catch (error) {
      next(error);
    }
  };

  public actived = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await productsService.actived(req.query, req.user);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };
  public uploadMainImage = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      
      const products = await productsService.uploadMainImage(req.params.id,  req.files);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  public deleteMainImage = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await productsService.deleteMainImage(req.params.id);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  public deleteGalleryImage = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await productsService.deleteGalleryImage(req.params.id, req.params.galleryId);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };
};

export const productsController = new ProductsController();
