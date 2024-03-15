import { Container } from 'inversify';
import {
  apiModule,
  infrastructureModule,
  middlewaresModule,
} from '@/container';
import { registerControllers } from '@/api/controllers/registry';
import {
  ILOGGER_SERVICE,
  ILoggerService,
} from '@/infrastructure/logger/ILogger.Service';
import { InversifyExpressServer } from 'inversify-express-utils';
import { json, urlencoded } from 'body-parser';
import routeLoggerMiddleware from '@/api/middleware/route-logger';
import { Application } from 'express';
import { ERRORHANDLER_MIDDLEWARE } from '@/api/middleware/error-handler';
import ErrorHandlerMiddleware from '@/api/middleware/error-handler';
import DeserializerMiddleware, {
  DESERIALIZER_MIDDLEWARE,
} from './middleware/deserializer';
import {
  LaunchDarklyService,
  LAUNCHDARKLY_SERVICE,
} from '@/infrastructure/configuration/launchdarkly.service';

export async function buildApplication(): Promise<{
  application: Application;
  container: Container;
}> {
  // this might be controller specific
  const container = new Container({
    autoBindInjectable: true,
    skipBaseClassChecks: true,
  });
  await container.loadAsync(infrastructureModule, apiModule, middlewaresModule);

  await registerControllers();
  const _loggerService = container.get<ILoggerService>(ILOGGER_SERVICE);
  const _errorHandler = container.get<ErrorHandlerMiddleware>(
    ERRORHANDLER_MIDDLEWARE,
  );
  const deserializerMiddleware = container.get<DeserializerMiddleware>(
    DESERIALIZER_MIDDLEWARE,
  );

  const launchDarklyService =
    container.get<LaunchDarklyService>(LAUNCHDARKLY_SERVICE);

  await launchDarklyService.initialize();

  // start the server
  const server = new InversifyExpressServer(container, null);

  server.setConfig((app) => {
    app.use(
      urlencoded({
        extended: true,
      }),
    );
    app.use(
      json({
        type: [
          'application/json',
          'application/vnd.api+json',
          'application/x-www-form-urlencoded',
        ],
      }),
    );
    routeLoggerMiddleware(app, _loggerService);
    app.use('/*', deserializerMiddleware.handler.bind(deserializerMiddleware));
  });

  // Catch and handle any uncaught exceptions automatically.
  // Instances of HttpException use the appropriate status code and pass along a message.
  // Unknown errors are treated as a generic InternalServerException with a 500 status.
  server.setErrorConfig((app) => {
    app.use(_errorHandler.handleError.bind(_errorHandler));
  });

  const application = server.build();
  return {
    application,
    container,
  };
}
