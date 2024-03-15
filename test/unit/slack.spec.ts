const chat = {
  postMessage: jest.fn(),
};

jest.mock('@slack/web-api', () => {
  const slack = {
    chat,
  };
  return { WebClient: jest.fn(() => slack) };
});

// purposly importing after the mocks
// because of jest hoisting that wont work otherwise
import sendSlackMessage from '@/infrastructure/slack/slack';
import { ChatPostMessageResponse } from '@slack/web-api';

describe('slack.module Unit Test', () => {
  it('Should send slack message if no errors', async () => {
    chat.postMessage.mockResolvedValueOnce({
      result: {
        ok: true,
        channel: 'channelId',
      },
    } as unknown as ChatPostMessageResponse);
    const response = await sendSlackMessage('channelId', 'woohooo slack bots');

    expect(response.result).toEqual({
      ok: true,
      channel: 'channelId',
    });
  });

  it('Should throw any given errors', async () => {
    chat.postMessage.mockRejectedValueOnce(new Error('This aint working'));
    const response = sendSlackMessage('channelId', 'woohooo slack bots');

    await response.catch((e) => {
      expect(e).toEqual(Error('This aint working'));
    });
  });
});
