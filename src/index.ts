import '@/infrastructure/datadog/tracer';
import 'reflect-metadata';
import dotenv from 'dotenv';
import {
  ILoggerService,
  ILOGGER_SERVICE,
} from './infrastructure/logger/ILogger.Service';
import {
  IConfigurationService,
  ICONFIGURATION_SERVICE,
} from './infrastructure/configuration/IConfig.Service';
import { buildApplication } from '@/api/api';

dotenv.config();

(async () => {
  const { application, container } = await buildApplication();
  const _configService = container.get<IConfigurationService>(
    ICONFIGURATION_SERVICE,
  );
  const _loggerService = container.get<ILoggerService>(ILOGGER_SERVICE);

  _loggerService.info({ message: 'Starting the API service' });
  application.listen(_configService.APP_PORT);

  _loggerService.info(`Server started on port ${_configService.APP_PORT}`);
})();
