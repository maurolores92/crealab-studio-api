import { Response, NextFunction } from 'express';
import { authServiceHelper } from '@src/core/helpers/auth.service.helper';

const optionalTokenValidation = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  try {
    if (authHeader) {
      const [_, token] = authHeader.split(' ');
      const user = await authServiceHelper.getDataByToken(token);
      req.user = user;
    }
    next();
  } catch (error) {
    res.status(403);
    res.json({ error: true, status: 403, message: error.message });
  }
};

export { optionalTokenValidation };
