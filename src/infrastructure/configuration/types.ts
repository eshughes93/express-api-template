import {
  AppConfig,
  LaunchDarklyConfig,
  PostgresConfig,
} from './IConfig.Service';

export type Config = AppConfig & PostgresConfig & LaunchDarklyConfig;
export type ConfigKeys = Array<keyof Config>;
