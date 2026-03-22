import { Resource } from "sst";
import type { Context } from "hono";
import { logMessageSchemaBase, logMessageSchema } from "@notify-hub/core";

const putMessage = async (c: Context): Promise<Response> => {
  const body = await c.req.json();
  const messageId = crypto.randomUUID();
  const message = logMessageSchemaBase.safeParse(body);
  if (!message.success) {
    return c.text("Invalid message", 422);
  }

  await Resource.NotifyHubQueue.send(
    logMessageSchema.parse({
      id: messageId,
      ...message.data,
      receivedAt: Date.now(),
    }),
  );

  return c.text(messageId, 202);
};

export default {
  putMessage,
};
