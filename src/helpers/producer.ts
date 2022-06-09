import kafkaClient from './client';
// import logger from './logger';
import {config} from '../config';
import {Producer, Message} from 'kafkajs';
import {ApptileEvent} from '../types';
import _ from 'lodash';
import {v4 as uuid} from 'uuid';

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
      //   logger.info(`Kafka Producer is Ready`);
      this.ready = true;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async produce(event: ApptileEvent) {
    try {
      if (!this.ready) {
        console.log('Producer not ready');
        throw 'Producer not ready';
      }

      if (event.message.value == null) {
        return Promise.reject('Please define event data');
      }

      //   if (!Array.isArray(messages)) {
      //     messages = [messages];
      //   }

      //   if (messages.length == 0) return Promise.resolve();

      //   messages = messages.map((m) => {
      //     const {value, headers, key} = m;
      //     return {value, headers, key};
      //   });

      if (!_.has(event, 'event.message.headers.eventGuid')) {
        _.set(event, 'message.headers.eventGuid', uuid());
      }

      const kafkaMessage: Message = {
        key: event.message.key,
        headers: event.message.headers,
        value: JSON.stringify(event.message.value),
        timestamp: event.message.timestamp,
        partition: event.message.partition
      };

      await this.kafkaProducer.send({
        acks: config.acks,
        topic: event.topic,
        messages: [kafkaMessage]
      });

      console.log(`Producer sent message msg to topic ${event.topic}`);
      return Promise.resolve();
    } catch (err) {
      // logger.error(`A problem occurred when sending our message: ${err}`);
      return Promise.reject(err);
    }
  }
}
