import { BaseEntity } from '@/domain/base.entity';

export class Example extends BaseEntity<Example> {
  updated_at = new Date();
  first_name!: string;
  last_name!: string;
  email!: string;

  constructor(data: Partial<Example>) {
    super({ id: data.id });
    Object.assign(this, data);
  }
}
