import { injectable } from 'inversify';
import { IConfigurationService } from './IConfig.Service';

@injectable()
export abstract class BaseConfigService implements IConfigurationService {
  public IS_TESTING!: boolean;
  public NODE_ENV!: string;
  public APP_PORT!: number;
  public HOST!: string;
  public APP!: string;
  public LOG_LEVEL!: string;
  public POSTGRES_HOST!: string;
  public POSTGRES_USER!: string;
  public POSTGRES_PASSWORD!: string;
  public POSTGRES_DB!: string;
  public POSTGRES_PORT!: number;
  public POOL_SIZE!: number;
  public SSL_MODE_NO_VERIFY!: boolean;

  public LAUNCH_DARKLY_SDK!: string;
  public LAUNCH_DARKLY_CONTEXT_KIND!: string;
  public LAUNCH_DARKLY_CONTEXT_KEY!: string;
  public LAUNCH_DARKLY_CONTEXT_NAME!: string;

  public page_size!: number;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  abstract setFlags(flags: object | undefined): void;
}
