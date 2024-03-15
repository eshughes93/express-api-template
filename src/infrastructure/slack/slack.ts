import { ChatPostMessageResponse, WebClient } from '@slack/web-api';

// this token is specific to a bot configured within
// the slack api, messages will be posted by said bot
const token = process.env.SLACK_BOT_TOKEN;
const client = new WebClient(token);

/**
 Used for sending a slack message with a bot
 the bot used for sending the message is determined by the SLACK_BOT_TOKEN
 @param channel channel that message is to be sent to, you can find this value in settings inside slack
 @param text string of text that the bot is going to send
*/
const sendSlackMessage = async (
  channel: string,
  text: string,
): Promise<ChatPostMessageResponse> | never => {
  try {
    const response = await client.chat.postMessage({
      token,
      channel,
      text,
    });

    return response;
  } catch (error) {
    throw error;
  }
};

export default sendSlackMessage;
