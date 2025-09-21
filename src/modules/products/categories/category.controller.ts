import { CrudController } from '@src/core/helpers';
import { ICategory } from './category.model';
import { categoryService } from './category.service';
import { NextFunction, Response } from 'express';

class CategoryController extends CrudController<ICategory> {
  constructor() {
    super(categoryService, 'Category-controller');
  }
  public all = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { pageSize, page, search } = req.query;
      const paginateRequest = { pageSize: Number(pageSize), page: Number(page) };
      const clients = await categoryService.getAll(paginateRequest);
      res.status(200).json(clients);
    } catch (error) {
      next(error);
    }
  }

  public actives = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await categoryService.actives();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
   public activesWithProducts = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const categories = await categoryService.getAllWithProducts();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  }
}

export const categoryController = new CategoryController();
