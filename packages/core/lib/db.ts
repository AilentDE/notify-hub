import type { D1Database } from "@cloudflare/workers-types";
import { drizzle } from "drizzle-orm/d1";
import * as webhookSchema from "../models/webhook-model";

export const createDb = (d1: D1Database) => {
  return drizzle(d1, { schema: { webhookSchema } });
};
