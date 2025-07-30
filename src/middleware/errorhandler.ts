import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const isProd = process.env.APP_ENV === 'production';

  const statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  const response = {
    success: false,
    message: err.message || 'Something went wrong',
    ...(isProd ? {} : { stack: err.stack }),
  };

  console.error('Error:', err);

  res.status(statusCode).json(response);
}