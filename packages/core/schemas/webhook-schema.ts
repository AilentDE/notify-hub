import { z } from "zod";

const webhookSchemaBase = z.object({
  origin: z.string().refine(
    (val) => {
      const urlPart = val.replace(/\/?\*$/, "");
      try {
        new URL(urlPart);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid URL pattern" },
  ),
  category: z.enum(["DISCORD", "TEAMS", "SLACK", "EMAIL", "SMS", "PUSH"]),
  endpoint: z.url(),
});

export const webhookSchemaUpsert = webhookSchemaBase.extend({
  id: z.number().optional(),
  isCanceled: z.boolean().default(false),
});

export type Webhook = z.infer<typeof webhookSchemaUpsert>;
