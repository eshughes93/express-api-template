/* eslint-disable @typescript-eslint/no-explicit-any */
export const ILOGGER_SERVICE = Symbol('ILOGGER_SERVICE');

interface LogMethod {
  (level: string, message: any): any;
}

interface LeveledLogMethod {
  (message: any): any;
}

export interface ILoggerService {
  log: LogMethod;
  error: LeveledLogMethod;
  critical: LeveledLogMethod;
  warn: LeveledLogMethod;
  info: LeveledLogMethod;
  trace: LeveledLogMethod;
  debug: LeveledLogMethod;
}
