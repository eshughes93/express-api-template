import { inject, injectable } from 'inversify';
import { IDatabaseProvider } from './IDatabase';
import { createPool, sql, type DatabasePool } from 'slonik';
import {
  ILoggerService,
  ILOGGER_SERVICE,
} from '@/infrastructure/logger/ILogger.Service';
import {
  IConfigurationService,
  ICONFIGURATION_SERVICE,
} from '@/infrastructure/configuration/IConfig.Service';

@injectable()
export class DatabaseProvider implements IDatabaseProvider {
  private _config: IConfigurationService;
  private _logger: ILoggerService;

  private pool!: DatabasePool;
  private port: number;
  private password: string;
  private user: string;
  private host: string;
  private db: string;

  constructor(
    @inject(ICONFIGURATION_SERVICE) configuration: IConfigurationService,
    @inject(ILOGGER_SERVICE) logger: ILoggerService,
  ) {
    this._logger = logger;
    this._config = configuration;

    this.port = this._config.POSTGRES_PORT;
    this.password = this._config.POSTGRES_PASSWORD;
    this.user = this._config.POSTGRES_USER;
    this.host = this._config.POSTGRES_HOST;
    this.db = this._config.POSTGRES_DB;
  }

  public async initialize() {
    this._logger.debug({
      message: 'Creating Database Pool v2',
      url: `postgres://****:****@${this.host}:${this.port}/${this.db}`,
    });
    const connectionString = `postgres://${this.user}:${this.password}@${this.host}:${this.port}/${this.db}`;
    const p = await this.createConnectionPool(connectionString);
    p.connect(() => {
      p.getPoolState();
      return Promise.resolve(true);
    });
    this.pool = p;
  }

  public getPool() {
    this._logger.info({
      message: 'Getting POOL',
      url: `postgres://${this.user}:${this.password}@${this.host}:${this.port}/${this.db}`,
    });
    return this.pool;
  }

  private async createConnectionPool(
    connectionString: string,
  ): Promise<DatabasePool> {
    // In your .env:
    //   Set SSL_MODE_NO_VERIFY=false if testing locally.
    //   Set SSL_MODE_NO_VERIFY=true if you are testing against alpha/staging etc.
    // Todo - figure out what sslmode we need for prod!
    const sslMode = this._config.SSL_MODE_NO_VERIFY ? '?sslmode=no-verify' : '';
    return await createPool(`${connectionString}${sslMode}`, {
      statementTimeout: 'DISABLE_TIMEOUT',
      connectionTimeout: 'DISABLE_TIMEOUT',
      maximumPoolSize: this._config.POOL_SIZE,
    });
  }

  public async closeConnectionPool(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
    }
  }

  public async testConnection(): Promise<{
    ready: boolean;
    service: 'database';
  }> {
    try {
      this._logger.info('Trying to connect to database...');
      const pool = this.getPool();
      await pool.connect(async (connect) => {
        await connect.query(sql`SELECT 1`);
      });
      this._logger.info('Successfully connected to database!');
      return { ready: true, service: 'database' };
    } catch (error) {
      this._logger.error({
        message: 'Failed to gain access to database',
        error: error,
        database: { host: this.host, port: this.port, db: this.db },
      });
      return { ready: false, service: 'database' };
    }
  }
}
