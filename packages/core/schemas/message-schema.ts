import { z } from "zod";

export enum LogType {
  SUCCESS = "SUCCESS",
  INFO = "INFO",
  DEBUG = "DEBUG",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

export const logMessageSchemaBase = z.object({
  type: z.enum(LogType),
  title: z.string(),
  message: z.string(),
  url: z.string().optional(),
  details: z.record(z.string(), z.any()).optional(),
  occurredAt: z.number(),
});

export const logMessageSchema = logMessageSchemaBase.extend({
  id: z.uuid({ version: "v4" }),
  receivedAt: z.number(),
});

export type LogMessage = z.infer<typeof logMessageSchema>;
