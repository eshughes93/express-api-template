import { AsyncContainerModule, interfaces } from 'inversify';
import {
  ILOGGER_SERVICE,
  ILoggerService,
} from '@/infrastructure/logger/ILogger.Service';
import { LoggerService } from '@/infrastructure/logger/logger';
import {
  ICONFIGURATION_SERVICE,
  IConfigurationService,
} from '@/infrastructure/configuration/IConfig.Service';
import { ConfigService } from '@/infrastructure/configuration/config.service';
import {
  IDATABASE_PROVIDER,
  IDatabaseProvider,
} from '@/infrastructure/database/IDatabase';
import { DatabaseProvider } from '@/infrastructure/database/database';
import {
  IExampleRepository,
  IEXAMPLE_REPOSITORY,
} from './domain/example/IExample.Repository';
import { ExampleRepository } from '@/infrastructure/repositories/example.repository';
import {
  IExampleService,
  IEXAMPLE_SERVICE,
} from '@/api/services/IExample.service';
import { ExampleService } from '@/api/services/example.service';
import {
  IHeartbeatService,
  IHEARTBEAT_SERVICE,
} from '@/infrastructure/IHeartbeat.Service';
import { HeartbeatService } from './infrastructure/heartbeat.service';
import DeserializerMiddleware, {
  DESERIALIZER_MIDDLEWARE,
} from '@/api/middleware/deserializer';
import ErrorHandlerMiddleware, {
  ERRORHANDLER_MIDDLEWARE,
} from '@/api/middleware/error-handler';
import {
  LaunchDarklyService,
  LAUNCHDARKLY_SERVICE,
} from './infrastructure/configuration/launchdarkly.service';
import { ILaunchDarklyService } from './infrastructure/configuration/ILaunchDarkly.service';

/**
 *
 * @param configService
 * @param loggerSerice
 * @returns
 */
const preInfrastructureSetup = async (
  configService: IConfigurationService,
  loggerSerice: ILoggerService,
) => {
  const dbClient: IDatabaseProvider = new DatabaseProvider(
    configService,
    loggerSerice,
  );
  await dbClient.initialize();

  return {
    dbClient,
  };
};

export const infrastructureModule = new AsyncContainerModule(
  async (bind: interfaces.Bind) => {
    const _configService = new ConfigService();
    const _loggingService = new LoggerService(_configService);

    const setup = await preInfrastructureSetup(_configService, _loggingService);

    bind<IConfigurationService>(ICONFIGURATION_SERVICE)
      .to(ConfigService)
      .inSingletonScope();

    bind<ILoggerService>(ILOGGER_SERVICE).to(LoggerService).inSingletonScope();
    bind<IDatabaseProvider>(IDATABASE_PROVIDER).toConstantValue(setup.dbClient);
    bind<IExampleRepository>(IEXAMPLE_REPOSITORY).to(ExampleRepository);
    bind<ILaunchDarklyService>(LAUNCHDARKLY_SERVICE)
      .to(LaunchDarklyService)
      .inSingletonScope();
  },
);

export const apiModule = new AsyncContainerModule(
  async (bind: interfaces.Bind) => {
    bind<IExampleService>(IEXAMPLE_SERVICE).to(ExampleService);
    bind<IHeartbeatService>(IHEARTBEAT_SERVICE).to(HeartbeatService);
  },
);

export const middlewaresModule = new AsyncContainerModule(
  async (bind: interfaces.Bind) => {
    bind<DeserializerMiddleware>(DESERIALIZER_MIDDLEWARE).to(
      DeserializerMiddleware,
    );
    bind<ErrorHandlerMiddleware>(ERRORHANDLER_MIDDLEWARE).to(
      ErrorHandlerMiddleware,
    );
  },
);
