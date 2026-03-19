import { Resource } from "sst";
import type { Context } from "hono";
import type { LogMessage } from "@notify-hub/core";

const putMessage = async (c: Context): Promise<Response> => {
  const body = await c.req.json();

  const messageId = crypto.randomUUID();
  const message: LogMessage = {
    id: messageId,
    type: body.type,
    message: body.message,
    url: body.url,
    details: body.details,
    occurredAt: body.occurredAt,
    receivedAt: Date.now(),
  };

  await Resource.NotifyHubQueue.send(message);

  return c.text(messageId, 202);
};

export default {
  putMessage,
};
