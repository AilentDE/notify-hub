import { z } from "zod";

const webhookSchemaBase = z.object({
  origin: z.url(),
  category: z.enum(["DISCORD", "TEAMS", "SLACK", "EMAIL", "SMS", "PUSH"]),
  endpoint: z.url(),
});

export const webhookSchemaUpsert = webhookSchemaBase.extend({
  id: z.number().optional(),
  isCanceled: z.boolean().default(false),
});
