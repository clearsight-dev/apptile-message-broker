import {IHeaders} from 'kafkajs';

export interface ApptileEventMessage {
  key?: string;
  value: object;
  partition?: number;
  headers?: IHeaders;
  timestamp?: string;
}

export interface ApptileEvent {
  topic: string;
  message: ApptileEventMessage;
}

export type ApptileEventHandler = (payload: ApptileEvent) => Promise<void>;
