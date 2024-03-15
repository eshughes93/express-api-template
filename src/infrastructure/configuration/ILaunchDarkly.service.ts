export interface ILaunchDarklyService {
  initialize: () => Promise<void>;
  testLaunchDarkly: () => Promise<{ ready: boolean; service: 'launchDarkly' }>;
}
