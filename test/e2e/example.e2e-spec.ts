import { RequestFn, TestUtils } from '../helpers/test-utils';
import { ObjectMother } from '../helpers/object-mother';

describe('Example Controller E2E Test', () => {
  let utils: TestUtils;
  let postExample: RequestFn;
  beforeAll(async () => {
    utils = await TestUtils.setup();
    postExample = utils.wrapPostRequest('/example/create');
  });

  afterAll(async () => {
    if (utils) {
      await utils.teardown();
    }
  });

  describe('POST /example/create', () => {
    it('POST /example/create (200)', async () => {
      const requestBody = ObjectMother.buildJsonApiExampleRequest();
      await postExample(requestBody)
        // .expect(200)
        .then(({ body, statusCode }) => {
          console.log('body:', body);
          expect(statusCode).toBe(200);
          expect(body.data).not.toBeUndefined();
          expect(body.data.type).not.toBeUndefined();
          expect(body.data.type).toBe('example');
          expect(body.data.attributes).not.toBeUndefined();
        });
    });
  });
});
