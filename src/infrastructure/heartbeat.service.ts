import { inject, injectable } from 'inversify';
import {
  ILoggerService,
  ILOGGER_SERVICE,
} from '@/infrastructure/logger/ILogger.Service';
import {
  IConfigurationService,
  ICONFIGURATION_SERVICE,
} from '@/infrastructure/configuration/IConfig.Service';
import {
  IDatabaseProvider,
  IDATABASE_PROVIDER,
} from '@/infrastructure/database/IDatabase';
import { IHeartbeatService } from './IHeartbeat.Service';
import { get } from 'http';
import {
  LaunchDarklyService,
  LAUNCHDARKLY_SERVICE,
} from './configuration/launchdarkly.service';

@injectable()
export class HeartbeatService implements IHeartbeatService {
  private _config: IConfigurationService;
  private _logger: ILoggerService;
  private _db: IDatabaseProvider;
  private _launchDarkly: LaunchDarklyService;

  constructor(
    @inject(ICONFIGURATION_SERVICE) configuration: IConfigurationService,
    @inject(ILOGGER_SERVICE) logger: ILoggerService,
    @inject(IDATABASE_PROVIDER) database: IDatabaseProvider,
    @inject(LAUNCHDARKLY_SERVICE) launchDarklyService: LaunchDarklyService,
  ) {
    this._logger = logger;
    this._config = configuration;
    this._db = database;
    this._launchDarkly = launchDarklyService;
  }

  public async readyCheck(): Promise<{ ready: boolean; message: string[] }> {
    this._logger.debug('Running Heartbeat / Ready up Checks');
    return await Promise.all([
      this.testInternetConnection(),
      this._db.testConnection(),
      this._launchDarkly.testLaunchDarkly(),
    ]).then((result) => {
      const response = { ready: true, message: [] as string[] };

      result.forEach((res) => {
        if (!res.ready) {
          response.ready = false;
          response.message.push(res.service);
        }
      });

      // Returns a response with status false, which the heartbeat controller can check for
      return Promise.resolve(response);
    });
  }

  public liveCheck() {
    this._logger.info('Running Live check');
    return 'live';
  }

  testInternetConnection(): Promise<{
    ready: boolean;
    service: 'internet';
  }> {
    this._logger.info('Trying to connect to internet...');
    return new Promise((resolve) => {
      get(
        {
          hostname: 'www.google.com',
        },
        () => {
          this._logger.info('Successfully connected to the internet!');
          resolve({ ready: true, service: 'internet' });
        },
      ).on('error', () => {
        this._logger.error('Failed to connect to the internet.');
        resolve({ ready: false, service: 'internet' });
      });
    });
  }
}
