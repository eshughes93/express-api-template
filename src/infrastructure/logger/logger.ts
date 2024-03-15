import { inject, injectable } from 'inversify';
import {
  IConfigurationService,
  ICONFIGURATION_SERVICE,
} from '@/infrastructure/configuration/IConfig.Service';
import { ILoggerService } from '@/infrastructure/logger/ILogger.Service';
@injectable()
export class LoggerService
  implements ILoggerService
{
  public constructor(
    @inject(ICONFIGURATION_SERVICE) configuration: IConfigurationService,
  ) {
    // todo
  }
}
