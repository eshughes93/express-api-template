import { QueryResultRow } from 'slonik';
import { Example } from './Example.Entity';

export const IEXAMPLE_REPOSITORY = Symbol('IEXAMPLE_REPOSITORY');

export interface IExampleRepository {
  create(example: Partial<Example>): Promise<Example>;
  getById(id: string): Promise<Example>;
  findAndCountAll(
    created_at: Date,
    limit: number,
    offset: number,
  ): Promise<Array<QueryResultRow>>;
}
