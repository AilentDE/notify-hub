import { ErrorType } from "./log-types";

export interface LogMessage {
  type: ErrorType;
  message: string;
  url?: string;
  details?: Record<string, unknown>;
  occurredAt: string;
  receivedAt: string;
}
