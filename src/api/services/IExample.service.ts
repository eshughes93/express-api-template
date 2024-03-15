import { Example } from '@/domain/example/Example.Entity';
import { ExampleRequest } from '@/api/models/example.request';

export const IEXAMPLE_SERVICE = Symbol('IEXAMPLE_SERVICE');

//TODO Move to a general area?
type ResultSet = {
  rows: Array<Example>;
  total?: number;
  totalPages?: number;
  currentPage?: number;
};
export interface IExampleService {
  create(example: Partial<ExampleRequest>): Promise<Example>;
  getById(id: string): Promise<Example>;
  getExamples(
    created_at?: Date,
    limit?: number,
    page?: number,
  ): Promise<ResultSet>;
}
