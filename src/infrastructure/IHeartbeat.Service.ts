export const IHEARTBEAT_SERVICE = Symbol('IHEARTBEAT_SERVICE');

export interface IHeartbeatService {
  readyCheck: () => Promise<{ ready: boolean; message: string[] }>;
  liveCheck: () => string;
}
