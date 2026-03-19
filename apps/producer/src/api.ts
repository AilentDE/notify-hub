import { Hono } from "hono";
import { Resource } from "sst";
import { cors } from "hono/cors";
import type { LogMessage } from "@notify-hub/core";

const app = new Hono();

app.use("*", cors());

app.post("/log", async (c) => {
  const body = await c.req.json();

  const messageId = crypto.randomUUID();
  const payload: LogMessage = {
    id: messageId,
    type: body.type,
    message: body.message,
    url: body.url,
    details: body.details,
    occurredAt: body.occurredAt,
    receivedAt: Date.now(),
  };

  await Resource.NotifyHubQueue.send(payload);

  return c.text(messageId, 202);
});

export default app;
