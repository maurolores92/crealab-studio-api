import { NextFunction, Request } from 'express';
import { ApiErrorResponse } from '@src/core/interfaces/response.interface';
import { HttpException, BasicException } from '@src/core/exceptions';
// import * as Sentry from '@sentry/node';

export const errorResponseHandler = async (
  error: BasicException,
  req: Request,
  res: any,
  next: NextFunction
): Promise<void> => {
  let data = null;
  if (!(error instanceof HttpException)) {
    const stack: string[] = error.stack?.split('\n');
    data = {
      stack,
    };
  }
  const errorResponse: ApiErrorResponse<any> = {
    statusCode: error.statusCode ?? 500,
    errorMessage: error.message,
    action: error.action,
    data: data,
  };

  if(process.env.ENVIRONMENT === 'local') {
    console.error(errorResponse);
  }
  // Sentry.captureException(error);
  res.status(error.statusCode ?? 500)
    .json(errorResponse);
};
