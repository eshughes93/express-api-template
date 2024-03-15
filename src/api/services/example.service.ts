import { injectable, inject } from 'inversify';
import {
  IExampleRepository,
  IEXAMPLE_REPOSITORY,
} from '@/domain/example/IExample.Repository';
import { IExampleService } from './IExample.service';
import {
  ILoggerService,
  ILOGGER_SERVICE,
} from '@/infrastructure/logger/ILogger.Service';
import { ExampleRequest } from '@/api/models/example.request';
import { Example } from '@/domain/example/Example.Entity';

@injectable()
export class ExampleService implements IExampleService {
  private readonly _exampleRepository: IExampleRepository;
  private readonly _loggingService: ILoggerService;

  constructor(
    @inject(IEXAMPLE_REPOSITORY)
    exampleRepository: IExampleRepository,
    @inject(ILOGGER_SERVICE)
    loggingService: ILoggerService,
  ) {
    this._exampleRepository = exampleRepository;
    this._loggingService = loggingService;
  }

  async create(example: ExampleRequest) {
    this._loggingService.info({ message: 'The Example', example });
    const ex = await this._exampleRepository.create(
      example as unknown as Example,
    );
    this._loggingService.info({ message: 'Database Entry', example: ex });
    return ex;
  }

  async getById(id: string) {
    this._loggingService.info({ message: 'Get By Id', params: { id } });

    const ex = await this._exampleRepository.getById(id);

    return ex;
  }

  async getExamples(created_at: Date = new Date(), limit = 500, page = 1) {
    const result = await this._exampleRepository.findAndCountAll(
      created_at,
      limit,
      page,
    );

    const totalRows = result.length > 0 ? (result[0].total as number) : 0;
    const totalPages = Math.ceil(totalRows / limit);

    const ret = {
      rows: result.map((val) => new Example(val)),
      total: totalRows,
      totalPages: totalPages,
      currentPage: page,
    };

    return ret;
  }
}
