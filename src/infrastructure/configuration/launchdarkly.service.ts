import { inject, injectable } from 'inversify';
import {
  ILoggerService,
  ILOGGER_SERVICE,
} from '@/infrastructure/logger/ILogger.Service';
import {
  init,
  LDOptions,
  LDClient,
  LDContext,
} from 'launchdarkly-node-server-sdk';
import {
  IConfigurationService,
  ICONFIGURATION_SERVICE,
  LaunchDarklyFlags,
} from './IConfig.Service';
import { ILaunchDarklyService } from './ILaunchDarkly.service';

export const LAUNCHDARKLY_SERVICE = Symbol('LAUNCHDARKLY_SERVICE');

@injectable()
export class LaunchDarklyService implements ILaunchDarklyService {
  private _loggerService: ILoggerService;
  private _configurationService: IConfigurationService;
  private _lauchDarklyClient!: LDClient;
  public constructor(
    @inject(ILOGGER_SERVICE) loggerService: ILoggerService,
    @inject(ICONFIGURATION_SERVICE) configurationService: IConfigurationService,
  ) {
    this._loggerService = loggerService;
    this._configurationService = configurationService;
  }

  /**
   *
   */
  public async initialize() {
    if (!this._lauchDarklyClient) {
      this._lauchDarklyClient = init(
        this._configurationService.LAUNCH_DARKLY_SDK,
        this.getOptions(),
      );
      const timeout = new Promise((resolve, reject) =>
        setTimeout(() => reject(`Timed out after 300000 ms.`), 300000),
      );
      try {
        await Promise.race([
          this._lauchDarklyClient.waitForInitialization(),
          timeout,
        ]);
        // get all flags
        const flags = await this._lauchDarklyClient.allFlagsState(
          this.getContext(),
        );
        this._loggerService.debug({
          message: 'LaunchDarkly Flags',
          flags: flags.toJSON(),
        });
        // set flags to configuration service
        this._configurationService.setFlags(
          flags.toJSON() as LaunchDarklyFlags,
        );
      } catch (error) {
        // Initialization failed
        // Log if failed Set defaults for flags
        this._loggerService.error({
          message:
            'Intialization failed for launchdarkly, all flags set to default',
          error,
        });
        this._configurationService.setFlags(undefined);
      }
    }
  }

  /**
   *
   * @returns LaunchDarkly setup options
   */
  private getOptions(): LDOptions {
    const options: LDOptions = {
      timeout: 3,
    };

    return options;
  }

  public async testLaunchDarkly(): Promise<{
    ready: boolean;
    service: 'launchDarkly';
  }> {
    try {
      this._loggerService.debug('Checking on LaunchDarkly');
      let ldCheck = false;
      if (this._lauchDarklyClient) {
        ldCheck = this._lauchDarklyClient.initialized();

        const flags = await this._lauchDarklyClient.allFlagsState(
          this.getContext(),
        );

        this._loggerService.debug({
          message: 'LaunchDarkly Flags',
          flags: flags,
        });
        this._loggerService.debug('Successfully initialized LaunchDarkly!');
      }
      return { ready: ldCheck, service: 'launchDarkly' };
    } catch (error) {
      this._loggerService.error({
        message: 'Failed to initialize launchDarkly',
        error: error,
      });
      return { ready: false, service: 'launchDarkly' };
    }
  }

  /**
   *
   * @returns Context for fetching flags
   */
  private getContext(): LDContext {
    const serviceContext = {
      kind: this._configurationService.LAUNCH_DARKLY_CONTEXT_KIND,
      key: this._configurationService.LAUNCH_DARKLY_CONTEXT_KEY,
      name: this._configurationService.LAUNCH_DARKLY_CONTEXT_NAME,
    };
    return serviceContext;
  }
}
