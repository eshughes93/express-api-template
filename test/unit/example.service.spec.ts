import 'reflect-metadata';
import { ExampleRequest } from '@/api/models/example.request';
import { IExampleService } from '@/api/services/IExample.service';
import { IExampleRepository } from '@/domain/example/IExample.Repository';
import { ILoggerService } from '@/infrastructure/logger/ILogger.Service';
import { ExampleService } from '@/api/services/example.service';
import { Example } from '@/domain/example/Example.Entity';

describe('Example.Service Unit Test', () => {
  let exampleService: IExampleService | null;
  let mockExampleRepository: IExampleRepository;
  let mockLoggerService: ILoggerService;

  beforeAll(() => {
    mockExampleRepository = {
      create: jest.fn(),
      getById: jest.fn(),
      findAndCountAll: jest.fn(),
    };

    mockLoggerService = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      info: jest.fn(),
      debug: jest.fn(),
      critical: jest.fn(),
      trace: jest.fn(),
    };
  });

  beforeEach(() => {
    exampleService = new ExampleService(
      mockExampleRepository,
      mockLoggerService,
    );
  });

  afterEach(() => {
    exampleService = null;
  });

  it('Should return Example Model with Populated Id', async () => {
    const theExample = new ExampleRequest({
      first_name: 'someone',
      last_name: 'somewhere',
      email: 'someone.somewhere@something.com',
      updated_at: new Date(),
    });

    jest.spyOn(mockExampleRepository, 'create').mockImplementationOnce(() => {
      const res = new Example(theExample);

      res.id = 'qwerty-1234-mock';

      return Promise.resolve(res);
    });

    const result = await exampleService?.create(theExample);

    expect(result?.email).toBe('someone.somewhere@something.com');
    expect(result?.id).toBe('qwerty-1234-mock');
    // do something
  });
});
