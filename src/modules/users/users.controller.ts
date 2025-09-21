import { CrudController } from '@src/core/helpers';
import { IUser } from './users.model';
import { userService } from './users.service';
import { Response, NextFunction } from 'express';
import { IRole } from './role/roles.model';
import { ApiResponse } from '@src/core/interfaces';

class UserController extends CrudController<IUser> {
  constructor() {
    super(userService, 'users-controller');
  }
  public getRoles = async(req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await userService.getRoles();
      const apiResponse: ApiResponse<IRole[]> = {
        statusCode: 200,
        statusMessage: 'Success',
        data,
      };
      res.status(200).json(apiResponse);
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
