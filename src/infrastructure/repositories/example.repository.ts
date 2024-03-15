import { Example } from '@/domain/example/Example.Entity';
import { IExampleRepository } from '@/domain/example/IExample.Repository';
import { inject, injectable } from 'inversify';
import { sql } from 'slonik';
import { IDatabaseProvider, IDATABASE_PROVIDER } from '../database/IDatabase';
import { ILoggerService, ILOGGER_SERVICE } from '../logger/ILogger.Service';

@injectable()
export class ExampleRepository implements IExampleRepository {
  private _database: IDatabaseProvider;
  private _logging: ILoggerService;
  private table_name: string;

  constructor(
    @inject(IDATABASE_PROVIDER) database: IDatabaseProvider,
    @inject(ILOGGER_SERVICE) loggingService: ILoggerService,
  ) {
    this._database = database;
    this._logging = loggingService;
    this.table_name = 'example_contact';
  }

  public async getById(id: string): Promise<Example> {
    const pool = this._database.getPool();
    const script = sql`SELECT * FROM ${sql.identifier([
      this.table_name,
    ])} WHERE id = ${id}`;
    return pool.connect(async (connection) => {
      return await connection.transaction(async (transaction) => {
        const result = await transaction.query(script);
        return new Example(result.rows[0]);
      });
    });
  }

  // custom methods...
  public async create(example: Partial<Example>): Promise<Example> {
    const pool = this._database.getPool();
    const script = sql`INSERT INTO ${sql.identifier([this.table_name])} (
        first_name, 
        last_name, 
        email
    ) VALUES (
        ${example.first_name || ''}, 
        ${example.last_name || ''}, 
        ${example.email || ''})
        RETURNING *`;
    this._logging.info({ message: 'SQL insert Script', script });
    return pool.connect(async (connection) => {
      return await connection.transaction(async (transaction) => {
        try {
          const result = await transaction.query(script);
          return new Example(result.rows[0]);
        } catch (error) {
          this._logging.error(error);
          throw error;
        }
      });
    });
  }

  public async findAndCountAll(
    created_at: Date = new Date(),
    limit = 500,
    offset = 1,
  ) {
    const pool = this._database.getPool();
    const script = sql`SELECT
        id,
        count(id) OVER() as total,
        first_name, 
        last_name, 
        email,
        updated_at,
        created_at 
      FROM ${sql.identifier([this.table_name])} 
      WHERE created_at >= ${sql.date(created_at)} 
      ORDER BY id, created_at 
      LIMIT ${limit} 
      OFFSET ${(offset - 1) * limit}`;
    return pool.connect(async (connection) => {
      const res = await connection.query(script);
      if (res.rowCount === 0) {
        return [];
      }
      return [...res.rows];
    });
  }
}
