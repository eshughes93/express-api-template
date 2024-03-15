# Express API Template

This template uses the [slonik library](https://github.com/gajus/slonik) instead of ORM libraries for reading and streaming postgres query data.
Stream function takes batch size parameter with which we can control chunks.

## information

This template is based on [Domain Driven Design, DDD](https://enlabsoftware.com/development/domain-driven-design-in-asp-net-core-applications.html). This uses both [express](https://github.com/expressjs/express) and [inversify](https://github.com/inversify/InversifyJS) (for IOC via Dependency Injection) to create an API template that allows you to inject different classes.

The container (`container.js`) is where we setup Dependency Injection.

`container.bind<IConfigurationService>(ICONFIGURATION_SERVICE).to(ConfigService);`

Folder Layout

- api -
  This is your business layer where a single, or many, domains can be brought together in a service or services.
  This has the controllers, aka routes, of your application.
- domain -
  This is where your entities live.
- infrastructure -
  This is where things like database connection, configuration and logging live.

##### Json:Api Specification

- Packages
  - jsonapi-query-parser
  - jsonapi-serializer
  - @types/jsonapi-serializer
- Classes
  - src/api/models/base.response.ts
  - src/api/controllers/base.controller.ts
- Middleware
  - For Middleware to work Header Content-type must be application/vnd.api+json or application/x-www-form-urlencoded
  - src/infrastructure/middleware/deserializer.ts

Examples
Setting up Serialization (src/api/models/example.response.ts)

```typescript
export class ExampleResponse extends BaseResponse {
    ...
    static _serializerOptions = (dataOptions?: SerializerDataOptions) => {
        const options: SerializerOptions = { ... };
        return options;
    };
    static _serializerCollection = 'example';
    ...
}
```

Using Serialization

```typescript
const items: Array<Example> = [];
const serializedItems = ExampleResponse.serialize<Example>(items);
```

##### LaunchDarkly

Update the values in the env:

- LAUNCH_DARKLY_SDK=SDK_SDK_SDK_SDK (SDK key of your launchdarkly)
- LAUNCH_DARKLY_CONTEXT_KIND=template (kind of context)
- LAUNCH_DARKLY_CONTEXT_KEY=express-template-key (The context key )
- LAUNCH_DARKLY_CONTEXT_NAME=express-service-template (The context name you are using)

Upon start up it will initialize, fetch flags and parse them into configuration service.

```typescript
const launchDarklyService =
  container.get<LaunchDarklyService>(LAUNCHDARKLY_SERVICE);

await launchDarklyService.initialize();
```

## Database Setup & Migrations

### Postgres & Docker

This uses postgres 13.
In this project you'll find a custom dockerfile for postgres which adds the `pg_partman` and `pg_cron` extensions
to make table partitioning automatic and easily managed. This dockerfile is found under `docker/postgres/Dockerfile`.

Additionally there is a folder `docker/postgres/init` which contains initialization scripts for postgres.
This adds the setup for `pg_cron` to be used and creates the database if it doesn't already exist. The folder is mounted to the postgres container and is run
upon initialization of the postgres volume.

### Migrations with Sqitch

This uses **sqitch** as a language agnostic migration tool.

Sqitch migrations are automatically run by the sqitch container in the docker compose setup, but you can run sqitch migrations manually as well.

If you add new migrations, you can simply deploy the latest by bringing up the sqitch container:

```shell
> docker compose up sqitch
```

## How to Run

### Copy Environment File

First, make sure to copy the `.env.example` file:

`cp .env.example .env`

You can edit the `.env` file to carry whatever values you prefer or need for your configuration.

### Install Packages

> This template requires node version 16. Use `nvm` to `install` and `use` version 16.

`npm install`

### Build Service

`docker compose -f docker-compose.yml up`

or

`npm run build && node ./dist/index.js`

### Depends on

[Posgres Slonik](https://github.com/gajus/slonik)
[JSON:API Specification](https://jsonapi.org)
[Domain Driven DDD](https://enlabsoftware.com/development/domain-driven-design-in-asp-net-core-applications.html)
[DDD Layers](https://ademcatamak.medium.com/layers-in-ddd-projects-bd492aa2b8aa)

## How to Test

To test, visit one of the controller URLs like this:

`http://localhost:3001/api/<api-name>`

### Examples

`http://localhost:3001/api/livez`

`http://localhost:3001/api/readyz`
