import { type DatabasePool } from 'slonik';

export const IDATABASE_PROVIDER = Symbol('IDATABASE_PROVIDER');

export interface IDatabaseProvider {
  initialize: () => Promise<void>;
  getPool: () => DatabasePool;
  closeConnectionPool: () => Promise<void>;
  testConnection: () => Promise<{ ready: boolean; service: 'database' }>;
}
