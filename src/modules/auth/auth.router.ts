import { Router } from 'express';
import { Route } from '@src/core/interfaces/route.interface';
import { authController } from './auth.controller';
import Context from '@src/core/middleware/context';
import { apiTokenValidation } from '@src/core/middleware';

class AuthRouter implements Route {
  basePath = '/auth';
  router = Router();
  constructor() {
    this.prepareRouters();
  }
  private prepareRouters = () => {
    this.router.post('/login', authController.login);
    this.router.post('/register', authController.signUp);
    this.router.post('/register-user', authController.registerUser);
    this.router.post('/change-password', authController.changePassword);
    this.router.get('/me', [apiTokenValidation, Context.create], authController.me);
    this.router.delete('/logout', [apiTokenValidation, Context.create] , authController.logout);
  };
}

export const authRouter = new AuthRouter();
