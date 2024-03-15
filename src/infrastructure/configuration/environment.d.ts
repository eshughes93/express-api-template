export {};

/**
 * This allows you to treat process.env.{ENV_VAR} as type 'string' instead of 'string | undefined'.
 * It's simply to prevent always casting `process.env.ENV_VAR as string`.
 * Don't add any variables here unless you're also adding them to the config verification
 * to make sure they really are defined.
 * Environment variables are ALWAYS STRINGS. Convert to numbers/booleans as needed in config.ts.
 */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      APP_PORT: string;
      APP: string;
      HOST: string;
      LOG_LEVEL: string;

      POSTGRES_HOST: string;
      POSTGRES_USER: string;
      POSTGRES_PASSWORD: string;
      POSTGRES_DB: string;
      POSTGRES_PORT: string;
      POOL_SIZE: string;
      SSL_MODE_NO_VERIFY: string;

      LAUNCH_DARKLY_SDK: string;
      LAUNCH_DARKLY_CONTEXT_KIND: string;
      LAUNCH_DARKLY_CONTEXT_KEY: string;
      LAUNCH_DARKLY_CONTEXT_NAME: string;
    }
  }
}
