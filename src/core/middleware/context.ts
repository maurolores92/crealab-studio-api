import { NextFunction, Response } from 'express';
import { UserContext } from '@src/core/interfaces/user.interface';
import { authServiceHelper } from '../helpers';

class Context {
  public static userId: number;
  public static user: UserContext;
  public static companyId: number;

  public static io: any;

  static async create(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const authHeader = req.headers['authorization'];
      if(authHeader ) {
        const [type, token] = authHeader.split(' ');
        Context.io = req.io;
        Context.user = await authServiceHelper.getDataByTokenAndKey(token);
        Context.userId = Context.user.id;
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      next();
    }
  }
}

export default Context;