import {
  ILoggerService,
  ILOGGER_SERVICE,
} from '@/infrastructure/logger/ILogger.Service';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '@/api/helpers/http-exceptions';
import { StatusCodes } from 'http-status-codes';
import { ErrorResponse } from '@/api/models/error.response';
import { inject, injectable } from 'inversify';

export const ERRORHANDLER_MIDDLEWARE = Symbol('ERRORHANDLER_MIDDLEWARE');

@injectable()
class ErrorHandlerMiddleware {
  constructor(
    @inject(ILOGGER_SERVICE) private readonly _loggerService: ILoggerService,
  ) {}

  /* eslint-disable @typescript-eslint/no-unused-vars */
  handleError(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    if (error instanceof HttpError) {
      this._loggerService.error({ message: 'HttpException', error });
      res.status(error.statusCode);
      res.send(ErrorResponse.serialize(error));
    } else {
      this._loggerService.error({
        message: 'An unknown error occurred',
        error,
      });
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      // Don't send internal error messages
      res.send('An unknown error occurred.');
    }
  }
}

export default ErrorHandlerMiddleware;
