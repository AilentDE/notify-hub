import { Hono } from "hono";
import { cors } from "hono/cors";
import messageQueueRouter from "./routes/messagg-router";

const app = new Hono();

app.use("*", cors());

app.route("/message", messageQueueRouter);

export default app;
