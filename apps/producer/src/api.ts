import { Hono } from "hono";
import { cors } from "hono/cors";
import messageQueueRouter from "./routes/messagg-router";
import webhookRouter from "./routes/webhook-router";

const app = new Hono();

app.use("*", cors());

app.route("/message", messageQueueRouter);
app.route("/webhook", webhookRouter);

export default app;
