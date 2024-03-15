import { Application, NextFunction, Request, Response } from 'express';
import { ILoggerService } from '@/infrastructure/logger/ILogger.Service';

const routeLoggerMiddleware = (app: Application, logger: ILoggerService) => {
  app.use('/*', (req: Request, res: Response, next: NextFunction) => {
    logger.debug({
      message: 'RouteLogger',
      meta: {
        originalUrl: `${req.originalUrl}`,
        path: req.path,
        payload: req.body,
      },
    });
    next();
  });
};

export default routeLoggerMiddleware;
