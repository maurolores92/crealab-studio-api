import { CrudController } from '@src/core/helpers';
import { clientsService } from './client.service';
import { IClient } from './client.model';

import { NextFunction, Response } from 'express';
import { sequelize } from '@src/core/configurations';

class ClientsController extends CrudController<IClient> {
  constructor() {
    super(clientsService, 'clients-controller');
  }
  public create = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    const transaction = await sequelize.transaction();
    try {
      const result = await clientsService.createClient(req.body, transaction);
      await transaction.commit();
      res.status(200).json(result);
    } catch (error) {
      await transaction.rollback();
      next(error);
    }
  };
  
}

export const clientsController = new ClientsController();
