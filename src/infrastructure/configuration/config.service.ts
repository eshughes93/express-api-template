import { ConfigKeys } from './types';
import { injectable } from 'inversify';
import { BaseConfigService } from './base.config.service';
import { LaunchDarklyFlags } from './IConfig.Service';

@injectable()
export class ConfigService extends BaseConfigService {
  constructor() {
    super();

    this.verifyConfig();
    // Naming pattern matches .env file for consistency when accessing variables
    // e.g. config.ENV_VAR_NAME or configService.get('ENV_VAR_NAME')

    this.NODE_ENV = process.env.NODE_ENV || 'development';
    this.APP_PORT = ConfigService.port;
    this.HOST = ConfigService.host;
    this.APP = ConfigService.app;
    this.LOG_LEVEL = ConfigService.logLevel;

    this.POSTGRES_HOST = process.env.POSTGRES_HOST || '';
    this.POSTGRES_USER = process.env.POSTGRES_USER || '';
    this.POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD || '';
    this.POSTGRES_DB = process.env.POSTGRES_DB || '';
    this.POSTGRES_PORT = parseInt(process.env.POSTGRES_PORT || '');
    this.POOL_SIZE = parseInt(process.env.POOL_SIZE || '5');
    this.SSL_MODE_NO_VERIFY = process.env.SSL_MODE_NO_VERIFY === 'true';

    this.LAUNCH_DARKLY_SDK = process.env.LAUNCH_DARKLY_SDK;
    this.LAUNCH_DARKLY_CONTEXT_KEY = process.env.LAUNCH_DARKLY_CONTEXT_KEY;
    this.LAUNCH_DARKLY_CONTEXT_KIND = process.env.LAUNCH_DARKLY_CONTEXT_KIND;
    this.LAUNCH_DARKLY_CONTEXT_NAME = process.env.LAUNCH_DARKLY_CONTEXT_NAME;

    this.IS_TESTING = this.isTesting();
    this.setFlags(undefined);
  }

  /**
   *
   * @param flags LaunchDarkly Flags for Service
   */
  public setFlags(flags: LaunchDarklyFlags | undefined): void {
    const cleanFlags = flags || {};
    const flagValues = { ...this.defaultFlags, ...cleanFlags };
    // Set the flags
    this.page_size = flagValues.page_size;
  }

  public get defaultFlags(): LaunchDarklyFlags {
    return {
      page_size: 1,
    };
  }

  /**
   * When adding new ENV vars:
   * 1. Add relevant type config/types.ts
   * 2. Add variable to list of values to validate in in verifyConfig function
   * 2. Add variable to be surfaced in loadConfig function
   **/

  private isTesting(): boolean {
    const environment = process.env.NODE_ENV || 'development';
    return (
      environment === 'development' ||
      environment === 'local' ||
      environment === 'lab' ||
      environment === 'test'
    );
  }

  private verifyConfig(): void | never {
    // These types are enforced via ConfigVars, so in order to validate them here
    //   they must also exist on the config types.

    this.checkMissingEnvVars([
      // App environment e.g. 'test', 'development', 'alpha', 'staging', 'sandbox', 'production'
      'NODE_ENV',

      // Application port
      'APP_PORT',

      'POSTGRES_USER',
      'POSTGRES_PASSWORD',
      'POSTGRES_HOST',
      'POSTGRES_DB',
      'SSL_MODE_NO_VERIFY',

      'LAUNCH_DARKLY_SDK',
      'LAUNCH_DARKLY_CONTEXT_KIND',
      'LAUNCH_DARKLY_CONTEXT_KEY',
      'LAUNCH_DARKLY_CONTEXT_NAME',
    ]);
    this.checkIntegerEnvVars(['APP_PORT', 'POSTGRES_PORT', 'POOL_SIZE']);
  }

  private checkMissingEnvVars(args: ConfigKeys): void | never {
    // Check for missing args
    const missing = args.filter((arg) => !process.env[arg]);
    if (missing.length > 0) {
      throw new Error(`Missing Environment variables: ${missing.join(', ')}`);
    }
  }

  private checkIntegerEnvVars(args: ConfigKeys): void | never {
    // Verify num values
    const invalidIntArgs = args.filter((arg) =>
      isNaN(parseInt(process.env[arg])),
    );

    if (invalidIntArgs.length > 0) {
      throw new Error(
        `Variable should be a number: ${invalidIntArgs.join(', ')}`,
      );
    }
  }

  private static get app(): string {
    return process.env.APP || 'Example App';
  }

  private static get port(): number {
    return parseInt(process.env.APP_PORT ?? '30001');
  }

  private static get host(): string {
    return process.env.HOST || 'localhost';
  }

  private static get logLevel(): string {
    return process.env.LOG_LEVEL || 'debug';
  }

  static get baseUrl(): string {
    return new URL(`http://${this.host}:${this.port}`).toString();
  }
}
