import {
  controller,
  httpGet,
  httpPost,
  requestBody,
  requestParam,
  response,
} from 'inversify-express-utils';
import { inject } from 'inversify';
import { Response } from 'express';
import {
  IExampleService,
  IEXAMPLE_SERVICE,
} from '../services/IExample.service';
import { ExampleRequest } from '../models/example.request';
import { BaseController } from './base.controller';
import { ExampleResponse } from '../models/example.response';
import {
  ILoggerService,
  ILOGGER_SERVICE,
} from '@/infrastructure/logger/ILogger.Service';

@controller('/example')
export class ExampleController extends BaseController {
  constructor(
    @inject(IEXAMPLE_SERVICE) private exampleService: IExampleService,
    @inject(ILOGGER_SERVICE) private loggerSerice: ILoggerService,
  ) {
    super();
  }

  @httpPost('/create')
  public async createExample(
    @response() res: Response,
    @requestBody() newExample: ExampleRequest,
  ): Promise<ExampleResponse | undefined> {
    try {
      const result = new ExampleResponse(
        await this.exampleService.create(newExample),
      );
      const payload = await ExampleResponse.serialize<ExampleResponse>(result);
      return payload;
    } catch (error: unknown) {
      console.log('error:', error);
      res.status(500);
      if (error instanceof Error) {
        res.send(error.message);
      }
    }
  }

  @httpGet('/:id')
  public async getUser(
    @response() res: Response,
    @requestParam('id') idParam: string,
  ): Promise<ExampleResponse | undefined> {
    try {
      const result = new ExampleResponse(
        await this.exampleService.getById(idParam),
      );
      return await ExampleResponse.serialize<ExampleResponse>(result);
    } catch (error: unknown) {
      res.status(500);
      if (error instanceof Error) {
        res.send(error.message);
      }
    }
  }
}
