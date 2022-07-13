export interface ApptileEventHeaders {
  eventGuid?: string;
  requestId?: string;
  clinetId?: string;
  originalTopic?: string;
  retryAttempts?: string;
  retryBackoffDelay?: string;
  createdAt?: string;
  [key: string]: string;
}

export interface ApptileEventMessage {
  key?: string;
  value: object;
  partition?: number;
  headers?: ApptileEventHeaders;
  timestamp?: string;
}

export interface ApptileEvent {
  topic: string;
  message: ApptileEventMessage;
}

export type ApptileEventHandler = (payload: ApptileEvent) => Promise<void>;

export class NonRetryableError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
