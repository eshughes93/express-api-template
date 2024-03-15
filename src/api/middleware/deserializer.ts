import { NextFunction, Request, Response } from 'express';
import {
  ILoggerService,
  ILOGGER_SERVICE,
} from '@/infrastructure/logger/ILogger.Service';
import { Deserializer } from 'jsonapi-serializer';
import JsonApiQueryParser, { IRequestData } from 'jsonapi-query-parser';
import {
  BadRequestError,
  UnsupportedMediaTypeError,
} from '@/api/helpers/http-exceptions';
import { BaseMiddleware } from 'inversify-express-utils';
import { inject, injectable } from 'inversify';
import {
  IConfigurationService,
  ICONFIGURATION_SERVICE,
} from '@/infrastructure/configuration/IConfig.Service';
import { ParsedQs } from 'qs';

export const DESERIALIZER_MIDDLEWARE = Symbol('DESERIALIZER_MIDDLEWARE');
@injectable()
class DeserializerMiddleware extends BaseMiddleware {
  private readonly deserializer: Deserializer;
  constructor(
    @inject(ILOGGER_SERVICE) private readonly _loggerService: ILoggerService,
    @inject(ICONFIGURATION_SERVICE)
    private readonly _configService: IConfigurationService,
  ) {
    super();

    this.deserializer = new Deserializer({
      keyForAttribute: 'underscore_case',
    });
  }

  public async handler(req: Request, res: Response, next: NextFunction) {
    const body = req.body;

    if (req.method === 'GET') {
      const parser = new JsonApiQueryParser();
      const parsedRequest = parser.parseRequest(req.originalUrl);
      const properlyTypedRequest =
        this.fixQueryParameterDataTypes(parsedRequest);
      req.query = { ...properlyTypedRequest } as unknown as ParsedQs;
      next();
      return;
    }
    if (req.headers['content-type'] === 'application/vnd.api+json') {
      const data = body.data;
      //if this payload is like JSON:API Schema parse
      if (data && data.type && data.attributes) {
        req.body = await this.deserializer.deserialize(req.body);
        next();
      } else {
        this._loggerService.error({
          message: 'Server requires JSON:API schema',
          data: req.body,
        });
        next(new BadRequestError('Server requires JSON:API schema'));
      }
    } else {
      next(
        new UnsupportedMediaTypeError(
          `Server only accepts the JSON:API media type header. Please use 'content-type':'application/vnd.api+json'`,
        ),
      );
    }
  }

  private fixQueryParameterDataTypes(req: IRequestData): IRequestData {
    // Since query parameters come in as strings, we need to convert some of those to the correct data type.
    if (req.queryData.page) {
      req.queryData.page.number = this.stringToNumber(
        req.queryData.page.number as string,
        1,
      );
      req.queryData.page.size = this.stringToNumber(
        req.queryData.page.size as string,
        30,
      ); // Since we default to 30 in base.controller.ts.
    }

    return req;
  }

  private stringToNumber(str: string, defaultValue = 0): number {
    const num = parseInt(str);
    return isNaN(num) ? defaultValue : num;
  }
}

export default DeserializerMiddleware;
