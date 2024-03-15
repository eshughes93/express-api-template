export abstract class BaseEntity<T extends BaseEntity<T>> {
  id: string | undefined;
  created_at = new Date();

  constructor(data: Partial<BaseEntity<T>>) {
    Object.assign(this, data);
  }

  // Keeping this fancey thing in case need in future
  // static fromRow<T>(rows: any, type: { new (rows: any): T }): T {
  //   return new type({ ...rows });
  // }
}
