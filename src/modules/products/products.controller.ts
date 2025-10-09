import { Request } from 'express';
import { productsService } from './products.service';
import { Response, NextFunction } from 'express';

class ProductsController  {

  public uploadProductGalleryImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = Number(req.params.id);
      if (!req.files || !req.files.image) throw new Error('No file uploaded');
      const file = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;
      const product = await productsService.uploadAndAddProductGalleryImage(productId, file);
      res.status(200).json({ statusCode: 200, statusMessage: 'Gallery image uploaded', data: product });
    } catch (error) {
      next(error);
    }
  };

  public async createWpProduct(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await productsService.createWpProduct(req.body);
      res.status(201).json({ statusCode: 201, statusMessage: 'Created', id: result?.id, data: result });
    } catch (error) {
      next(error);
    }
  }

  public getAllFromWordpress = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const products = await productsService.getAllFromWordpress(req.query);
      res.status(200).json({ statusCode: 200, statusMessage: 'Success', data: products });
    } catch (error) {
      next(error);
    }
  };

  public updateWpProduct = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await productsService.updateWpProduct(Number(req.params.id), req.body);
      res.status(200).json({ statusCode: 200, statusMessage: 'Updated', data: result });
    } catch (error) {
      next(error);
    }
  };

  public deleteFromWordpress = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await productsService.deleteFromWordpress(req.params.id);
      res.status(200).json({ statusCode: 200, statusMessage: 'Deleted', data: result });
    } catch (error) {
      next(error);
    }
  };

  public getWpProductById = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const product = await productsService.getWpProductById(Number(req.params.id));
      res.status(200).json({ statusCode: 200, statusMessage: 'Success', data: product });
    } catch (error) {
      next(error);
    }
  };

  public uploadProductImage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const productId = Number(req.params.id);
      if (!req.files || !req.files.image) throw new Error('No file uploaded');
      const file = Array.isArray(req.files.image) ? req.files.image[0] : req.files.image;
      const product = await productsService.uploadAndSetProductImage(productId, file);
      res.status(200).json({ statusCode: 200, statusMessage: 'Image uploaded and set', data: product });
    } catch (error) {
      next(error);
    }
  };
};

export const productsController = new ProductsController();
