import { webhooksTable } from "@notify-hub/core";
import { Context } from "hono";
import { getDb } from "../lib/db";

const testDb = async (c: Context): Promise<Response> => {
  const db = getDb();
  const result = await db.select().from(webhooksTable);

  return c.json({ result });
};

export default {
  testDb,
};
