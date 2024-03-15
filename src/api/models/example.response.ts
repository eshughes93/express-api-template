import { Example } from '@/domain/example/Example.Entity';
import { SerializerOptions } from 'jsonapi-serializer';
import { BaseResponse, SerializerDataOptions } from './base.response';

export class ExampleResponse extends BaseResponse implements Example {
  static _serializerOptions = (dataOptions?: SerializerDataOptions) => {
    const host = process.env.HOST;
    const port = process.env.APP_PORT;
    const url = `http://${host}:${port}/examples`;
    const options: SerializerOptions = {
      topLevelLinks: {
        self: function (data: ExampleResponse) {
          return `${url}/${data.id}`;
        },
      },
      attributes: [
        'first_name',
        'last_name',
        'email',
        'created_at',
        'updated_at',
      ],
      pluralizeType: false,
    };
    const pageInfo = this.getPageInformation(url, dataOptions);
    if (pageInfo) {
      options.meta = Object.assign(pageInfo.meta, options.meta || {});
      options.topLevelLinks = Object.assign(
        options.topLevelLinks,
        pageInfo.links,
      );
    }

    return options;
  };
  static _serializerCollection = 'example';

  id!: string | undefined;
  created_at!: Date;
  updated_at!: Date;
  first_name!: string;
  last_name!: string;
  email!: string;

  constructor(data: ExampleResponse) {
    super({});
    Object.assign(this, data);
  }
}
