import { NextFunction, Request, Response } from 'express';
import { authService } from './auth.service';
import { ChangePasswordRequest, LoginRequest } from '@src/core/interfaces';

class AuthController {
  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dataLogin: LoginRequest = req.body;
      const result = await authService.login(dataLogin);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
  
  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.signUp(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

    public registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.registerUser(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };

  public me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers['authorization'];
      const result = await authService.me(token);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
  public changePassword = async (req: Request<ChangePasswordRequest>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await authService.changePassword(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = {success: true};
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
