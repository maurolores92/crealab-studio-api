
import { categoryService } from './category.service';
import { NextFunction, Response } from 'express';

class CategoryController {
  // Listar categorías desde WooCommerce
  public all = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { pageSize, page } = req.query;
      const paginateRequest = { pageSize: Number(pageSize), page: Number(page) };
      const result = await categoryService.getAll(paginateRequest);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // Crear categoría en WooCommerce
  public create = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req.body;
      const created = await categoryService.create(data);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  };

  // Editar categoría en WooCommerce
  public update = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const updated = await categoryService.update(id, data);
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  };

  // Eliminar categoría en WooCommerce
  public remove = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const deleted = await categoryService.remove(id);
      res.status(200).json(deleted);
    } catch (error) {
      next(error);
    }
  };
}

export const categoryController = new CategoryController();
