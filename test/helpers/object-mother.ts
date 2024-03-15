import { faker } from '@faker-js/faker';
import { ExampleRequest } from '@/api/models/example.request';
import { Example } from '@/domain/example/Example.Entity';

export class ObjectMother {
  static buildExampleRequest(
    data: Partial<ExampleRequest> = {},
  ): ExampleRequest {
    const delivered_at = faker.date.recent();
    const date = faker.date.recent(365, delivered_at);
    const fn = faker.name.firstName();
    const ln = faker.name.lastName();
    const defaults: ExampleRequest = {
      updated_at: date,
      first_name: fn,
      last_name: ln,
      email: `${fn}.${ln}@${faker.word.noun()}.com`,
    };
    return {
      ...defaults,
      ...data,
    };
  }

  static buildExample(data: Partial<ExampleRequest> = {}): Example {
    return new Example(this.buildExampleRequest(data));
  }

  static buildJsonApiExampleRequest(data: Partial<ExampleRequest> = {}): {
    data: { type: string; attributes: ExampleRequest };
  } {
    const attributes = this.buildExampleRequest(data);
    return {
      data: {
        type: 'examples',
        attributes,
      },
    };
  }
}
