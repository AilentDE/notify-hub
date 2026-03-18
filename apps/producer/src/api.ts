import { Hono } from "hono";
import { Resource } from "sst";
import { cors } from "hono/cors";
import type { LogMessage } from "@notify-hub/core";

const app = new Hono();

app.use("*", cors());

app.post("/log", async (c) => {
  const body = await c.req.json();

  const payload: LogMessage = {
    type: body.type,
    message: body.message,
    url: body.url,
    details: body.details,
    occurredAt: body.occurredAt,
    receivedAt: new Date().toISOString(),
  };

  await Resource.NotifyHubQueue.send(payload);

  return c.json(payload);
});

export default app;
