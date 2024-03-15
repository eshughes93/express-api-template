import { Serializer, SerializerOptions } from 'jsonapi-serializer';
import { ConfigService } from '@/infrastructure/configuration/config.service';

export type SerializerDataOptions = {
  // Override the default URL
  customTopLevelUrl?: string;
  pages: {
    size: number;
    current: number;
    total: number;
  };
};

export abstract class BaseResponse {
  static _serializerOptions: (
    dataOptions?: SerializerDataOptions,
  ) => SerializerOptions;
  static _serializedAttributes: string[];
  static _serializerCollection: string;

  constructor(data: Partial<BaseResponse>) {
    Object.assign(this, data);
  }

  static getPageInformation(
    pageUrl: string,
    dataOptions?: SerializerDataOptions,
  ): { meta: object; links: object } | null {
    if (dataOptions && dataOptions.pages) {
      const url = dataOptions?.customTopLevelUrl ?? pageUrl;
      const options: { meta: object; links: object } = {
        meta: {},
        links: {},
      };
      const hasPages = dataOptions.pages.total > 0;
      options.meta = Object.assign(
        { totalPages: dataOptions.pages.total },
        options.meta || {},
      );
      if (hasPages && dataOptions.pages.size && dataOptions.pages.current) {
        // Casting to numbers because these are coming in as strings
        const total = +dataOptions.pages.total;
        const size = +dataOptions.pages.size;
        const current = +dataOptions.pages.current;
        options.links = {
          first: function () {
            return `${url}?page[number]=1&page[size]=${size}`;
          },
          last: function () {
            const last = total <= 0 ? 1 : total;
            return `${url}?page[number]=${last}&page[size]=${size}`;
          },
          previous: function () {
            if (current - 1 <= 0) {
              return null;
            }
            return `${url}?page[number]=${current - 1}&page[size]=${size}`;
          },
          next: function () {
            if (current + 1 > total) {
              return null;
            }
            return `${url}?page[number]=${current + 1}&page[size]=${size}`;
          },
          self: function () {
            return `${url}?page[number]=${current}&page[size]=${size}`;
          },
        };
      }
      return options;
    }

    return null;
  }

  static async serialize<T>(
    dataset: Array<T> | T,
    dataOptions?: SerializerDataOptions,
  ) {
    const serializer: Serializer = new Serializer(
      this._serializerCollection,
      this._serializerOptions(dataOptions),
    );
    const s = await serializer.serialize(dataset);
    return {
      ...s,
      jsonapi: { version: 1.0 },
    };
  }

  static getBaseUrl(): string {
    return ConfigService.baseUrl;
  }
}
