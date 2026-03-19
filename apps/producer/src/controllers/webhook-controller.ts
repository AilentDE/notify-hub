import { webhooksTable } from "@notify-hub/core";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { getDb } from "../lib/db";
import { webhookSchemaUpsert } from "@notify-hub/core";

const getWebhooks = async (c: Context): Promise<Response> => {
  const db = getDb();
  const result = await db.select().from(webhooksTable);

  return c.json({ result });
};

const upsertWebhook = async (c: Context): Promise<Response> => {
  const body = await c.req.json();
  const webhook = webhookSchemaUpsert.safeParse(body);
  if (!webhook.success) {
    return c.json({ error: JSON.parse(webhook.error.message) }, 422);
  }

  const db = getDb();
  if (webhook.data.id) {
    const result = await db
      .update(webhooksTable)
      .set({ ...webhook.data, updatedAt: new Date() })
      .where(eq(webhooksTable.id, webhook.data.id))
      .returning();
    return c.json(result, 200);
  }

  const result = await db
    .insert(webhooksTable)
    .values(webhook.data)
    .returning();
  return c.json(result, 201);
};

const deleteWebhook = async (c: Context): Promise<Response> => {
  const rawId = c.req.param("id");
  const id = Number(rawId);
  if (!Number.isInteger(id)) {
    return c.json({ error: "Invalid ID" }, 422);
  }

  const db = getDb();
  const result = await db
    .delete(webhooksTable)
    .where(eq(webhooksTable.id, id))
    .returning();
  return c.json(result, 200);
};

export default {
  getWebhooks,
  upsertWebhook,
  deleteWebhook,
};
