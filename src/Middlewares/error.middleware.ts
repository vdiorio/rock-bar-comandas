import {Request, Response, NextFunction} from 'express';
import HttpException from '../classes/httpException';

function errorMiddleware(
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // Set a default error status and message
  console.log(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Send the error response to the client
  return res.status(statusCode).json({message});
}

export default errorMiddleware;
