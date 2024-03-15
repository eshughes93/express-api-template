import { Example } from '@/domain/example/Example.Entity';

export class ExampleRequest implements Omit<Example, 'id' | 'created_at'> {
  updated_at!: Date;
  first_name!: string;
  last_name!: string;
  email!: string;

  constructor(data: ExampleRequest) {
    if (data.updated_at) {
      data.updated_at = new Date(data.updated_at);
    }
    Object.assign(this, data);
  }
}
