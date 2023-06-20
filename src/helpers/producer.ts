import kafkaClient from './client';
// import logger from './logger';
import {config} from '../config';
import {Producer, Message} from 'kafkajs';
import {ApptileEvent} from '../types';
import _ from 'lodash';
import {v4 as uuid} from 'uuid';
import {generateTraceId, getTracingId, logger} from '../apptile-common';

export default class ApptileEventProducer {
  private ready: boolean;
  private kafkaProducer: Producer;

  constructor() {
    this.ready = false;
  }

  async start() {
    try {
      if (this.ready) return Promise.resolve();

      this.kafkaProducer = kafkaClient.producer({
        allowAutoTopicCreation: false
      });
      await this.kafkaProducer.connect();
      logger.info(`Kafka Producer is Ready`);
      this.ready = true;
    } catch (e) {
      logger.error('error while starting producer', e);
      return Promise.reject(e);
    }
  }

  async produce(event: ApptileEvent) {
    try {
      if (!this.ready) {
        logger.error('Producer not ready');
        throw 'Producer not ready';
      }

      if (
        event.message.value == null ||
        event.message.value.eventName == null ||
        event.message.value.eventData == null
      ) {
        logger.error('event.message.value object not defined correctly');
        return Promise.reject('Please define event.message.value correctly');
      }

      event.message.headers = event.message.headers || {};
      var headers = event.message.headers;

      var eventGuid = headers.eventGuid || uuid();
      headers.eventGuid = eventGuid;
      headers.clinetId = config.clientId;
      headers.originalTopic = headers.originalTopic || event.topic;
      headers.createdAt = headers.createdAt || Date.now().toString();
      headers.traceId = getTracingId() || generateTraceId();

      const apptileMessage: Message = {
        key: event.message.key,
        headers: event.message.headers,
        value: JSON.stringify(event.message.value),
        timestamp: event.message.timestamp,
        partition: event.message.partition
      };

      await this.kafkaProducer.send({
        acks: config.producerConfig.acks,
        topic: event.topic,
        messages: [apptileMessage]
      });

      logger.debug(`Producer sent message msg to topic ${event.topic} with eventGuid ${eventGuid}`);
      return eventGuid;
    } catch (err) {
      logger.error(`A problem occurred when sending message`, err);
      return Promise.reject(err);
    }
  }
}
