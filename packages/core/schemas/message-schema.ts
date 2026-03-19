export enum LogType {
  SUCCESS = "SUCCESS",
  INFO = "INFO",
  DEBUG = "DEBUG",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}

export interface LogMessage {
  id: string;
  type: LogType;
  message: string;
  url?: string;
  details?: Record<string, any>;
  occurredAt: number;
  receivedAt: number;
}
