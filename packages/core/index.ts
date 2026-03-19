import { LogType } from "./log-types";

export interface LogMessage {
  id: string;
  type: LogType;
  message: string;
  url?: string;
  details?: Record<string, any>;
  occurredAt: number;
  receivedAt: number;
}
