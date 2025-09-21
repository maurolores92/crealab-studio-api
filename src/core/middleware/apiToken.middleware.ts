import { Response, NextFunction } from 'express';
import { authServiceHelper } from '@src/core/helpers/auth.service.helper';
import { HttpException } from '@src/core/exceptions';

const apiTokenValidation = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const apiKey: string = <string>req.headers['x-api-key'];
  try {
    if (!authHeader && !apiKey) {
      throw new HttpException('Header not exist.', 401);
    }
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      if (type !== 'Bearer') {
        throw new HttpException('Header type invalid', 401);
      }
      if (!token) {
        throw new HttpException('Invalid token', 401);
      }
      await authServiceHelper.getDataByToken(token);
    } 
    next();
  } catch (error) {
    res.status(403);
    res.json({ error: true, status: 403, message: error.message });
  }
};

export { apiTokenValidation };
