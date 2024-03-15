import { BaseHttpController } from 'inversify-express-utils';
import { IQueryData } from 'jsonapi-query-parser';

export class BaseController extends BaseHttpController {
  constructor() {
    super();
  }

  public getFields(queryData: IQueryData): Record<string, unknown> {
    if (!queryData || !queryData.fields) {
      return {};
    }

    return queryData.fields;
  }

  public getFilter(queryData: IQueryData): Record<string, unknown> {
    if (!queryData || !queryData.filter) {
      return {};
    }

    return queryData.filter;
  }

  public getPageData(
    queryData: IQueryData,
  ): Record<string, unknown | undefined> {
    if (!queryData || !queryData.page) {
      return {};
    }

    const page = queryData.page;

    return {
      size: page.size ? page.size : 30,
      number: page.number ? page.number : 1,
    };
  }
}
