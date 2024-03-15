import { Application } from 'express';
import { Container } from 'inversify';
import { buildApplication } from '@/api/api';
import { Server } from 'http';
import {
  IDATABASE_PROVIDER,
  IDatabaseProvider,
} from '@/infrastructure/database/IDatabase';
import supertest from 'supertest';

export class TestUtils {
  constructor(
    public container: Container,
    public server: Server,
    public application: Application,
    public request: supertest.SuperTest<supertest.Test>,
  ) {}

  static async setup(): Promise<TestUtils> {
    const { application, container } = await buildApplication();
    const server = await application.listen();
    const request = supertest(server);
    return new TestUtils(container, server, application, request);
  }

  async teardown(): Promise<void> {
    // Close server
    this.server.close();

    // Close db connections
    const databaseProvider =
      this.container.get<IDatabaseProvider>(IDATABASE_PROVIDER);
    await databaseProvider.closeConnectionPool();
  }

  static jsonApiHeaders() {
    return {
      'content-type': 'application/vnd.api+json',
    };
  }

  wrapPostRequest(route: string): RequestFn {
    return (body: Record<string, unknown>): supertest.Test => {
      return this.request
        .post(route)
        .set(TestUtils.jsonApiHeaders())
        .send(body);
    };
  }
}

export type RequestFn = (body: Record<string, unknown>) => supertest.Test;
