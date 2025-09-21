import { NextFunction, Response } from 'express';

class ContextIO {
  public static io: any;

  static async create(
    req: any,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      ContextIO.io = req.io;
    } catch (e: any) {
      console.error(e);
    } finally {
      next();
    }
  }
}

export default ContextIO;