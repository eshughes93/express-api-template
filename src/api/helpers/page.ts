import { ResultSet } from '@/api/models/result-set';
import { QueryResultRow } from 'slonik';

/**
 * Generic mapper for processing rows and constructing a page
 * @param rows
 * @param limit
 * @param page
 * @param entityConstructor
 */
export function buildResultSet<T>(
  rows: readonly QueryResultRow[],
  limit: number,
  page: number,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  entityConstructor: new (...args: any[]) => T,
): ResultSet<T> {
  const totalRows = rows.length > 0 ? (rows[0].total as number) : 0;
  const totalPages = Math.ceil(totalRows / limit);
  return {
    rows: rows.map((val) => new entityConstructor(val)),
    total: totalRows,
    totalPages: totalPages,
    currentPage: page,
  };
}

export const DEFAULT_LIMIT = 500;
export const DEFAULT_PAGE = 1;
