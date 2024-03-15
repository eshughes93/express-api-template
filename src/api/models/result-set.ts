export type ResultSet<T> = {
  rows: Array<T>;
  total?: number;
  totalPages?: number;
  currentPage?: number;
};
