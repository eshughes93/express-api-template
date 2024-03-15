import { controller, httpGet, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Response } from 'express';
import {
  IHeartbeatService,
  IHEARTBEAT_SERVICE,
} from '@/infrastructure/IHeartbeat.Service';
import {
  ILoggerService,
  ILOGGER_SERVICE,
} from '@/infrastructure/logger/ILogger.Service';

@controller('')
export class HeartbeatController {
  constructor(
    @inject(IHEARTBEAT_SERVICE) private heartbeatService: IHeartbeatService,
    @inject(ILOGGER_SERVICE) private loggerSerice: ILoggerService,
  ) {}

  @httpGet('/livez')
  public livez(@response() res: Response) {
    const result = this.heartbeatService.liveCheck();
    res.status(200).send({ status: result });
  }

  @httpGet('/readyz')
  public async readyz(@response() res: Response) {
    try {
      const result = await this.heartbeatService.readyCheck();
      res.status(200).send(result);
    } catch (error) {
      this.loggerSerice.error({
        error,
        message: 'readyz endpoint failed',
      });
      res.status(500).send({ ready: false, message: 'failed' });
    }
  }
}
