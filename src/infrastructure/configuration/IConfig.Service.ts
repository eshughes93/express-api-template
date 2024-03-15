export const ICONFIGURATION_SERVICE = Symbol('ICONFIGURATION_SERVICE');

export interface AppConfig {
  // App environment e.g. 'test', 'development', 'alpha', 'staging', 'sandbox', 'production'
  readonly NODE_ENV: string;

  readonly APP: string;
  readonly HOST: string;

  // Port for HTTP interface
  readonly APP_PORT: number;

  readonly LOG_LEVEL: string;
}

export interface LaunchDarklyConfig {
  readonly LAUNCH_DARKLY_SDK: string;
  readonly LAUNCH_DARKLY_CONTEXT_KIND: string;
  readonly LAUNCH_DARKLY_CONTEXT_KEY: string;
  readonly LAUNCH_DARKLY_CONTEXT_NAME: string;
}

export interface LaunchDarklyFlags {
  readonly page_size: number;
}

export interface PostgresConfig {
  readonly POSTGRES_HOST: string;
  readonly POSTGRES_USER: string;
  readonly POSTGRES_PASSWORD: string;
  readonly POSTGRES_DB: string;
  readonly POSTGRES_PORT: number;
  readonly SSL_MODE_NO_VERIFY: boolean;
  readonly POOL_SIZE: number;
}

export interface IConfigurationService
  extends AppConfig,
    PostgresConfig,
    LaunchDarklyConfig,
    LaunchDarklyFlags {
  IS_TESTING: boolean;

  setFlags(flags: LaunchDarklyFlags | undefined): void;
}
