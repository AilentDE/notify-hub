import { z } from "zod";

export const ResponseSchema = z.object({
  success: z.boolean().default(true),
  message: z.string().default(""),
  data: z.any().default(null),
  total: z.number().optional(),
  details: z.any().optional(),
});
