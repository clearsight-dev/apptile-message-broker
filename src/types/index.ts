export interface ApptileEventHeaders {
  eventGuid?: string;
  requestId?: string;
  clinetId?: string;
  originalTopic?: string;
  retryAttempts?: string;
  retryBackoffDelay?: string;
  retryTopic?: string;
  createdAt?: string;
  [key: string]: string;
}

export interface ApptileEventValue {
  eventName: string;
  eventData: object;
}

export interface ApptileEventMessage {
  key?: string;
  value: ApptileEventValue;
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
