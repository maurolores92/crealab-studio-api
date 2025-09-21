import { NextFunction, Response } from "express";
import { IStockDistribution } from "./stockDistribution.model";
import {  stockDistributionService } from "./stockDistribution.service";
import { CrudController } from '@src/core/helpers';

class StockDistributionController extends CrudController<IStockDistribution> {
  constructor() {
    super(stockDistributionService, 'stock-distribution-controller');
  }
  public addStock = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await stockDistributionService.addStock(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const stockDistributionController = new StockDistributionController();
