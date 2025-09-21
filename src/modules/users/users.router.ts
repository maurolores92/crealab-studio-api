import { CrudRouter } from '@src/core/helpers/database/crud.router';
import { IUser } from './users.model';
import { userController } from './users.controller';

class UserRouter extends CrudRouter<IUser> {
  constructor() {
    super('/user', userController);
    
    this.prepareRouters();
    this.initRoutes([]);
  }
  private prepareRouters = (): void => {
   this.router.get('/roles', userController.getRoles);
   this.router.post('/roles', userController.getRoles);
  };
}

export const userRouter = new UserRouter();
