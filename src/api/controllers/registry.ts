/**
 * This is the place where we register all controllers in out applicaiton
 *
 * This is required per inversify so that the meta data @controller can be processed
 * relative for injection and for building routes.
 */

export const registerControllers = async () => {
  await require('@/api/controllers/example.controller');
  await require('@/api/controllers/heartbeat.controller');
};
