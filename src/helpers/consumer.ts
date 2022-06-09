import kafkaClient from './client';
import {config} from '../config';
import {Consumer} from 'kafkajs';

import {ApptileEvent, ApptileEventHandler} from '../types';

export default class ApptileEventConsumer {
  private kafkaConsumer: Consumer;
  private topicsList: string[];
  private messageHandler: ApptileEventHandler;
  private ready: boolean;
  constructor() {
    this.ready = false;
  }

  async start(topicsList: string[], messageHandler: ApptileEventHandler) {
    try {
      if (this.ready) return Promise.resolve();

      if (!topicsList) return Promise.reject('Cannot start without a topic list');

      this.topicsList = topicsList;

      const consumerConfig = {
        groupId: config.defaultGroupId,
        maxBytesPerPartition: config.maxBytesPerPartition,
        heartbeatInterval: config.heartbeatInterval,
        fromBeginning: config.fromBeginning
      };

      this.kafkaConsumer = kafkaClient.consumer(consumerConfig);
      this.messageHandler = messageHandler;

      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe({topics: this.topicsList});

      await this.kafkaConsumer.run({
        autoCommit: true,
        autoCommitInterval: config.commitInterval,
        partitionsConsumedConcurrently: config.partitionsConsumedConcurrently,
        eachMessage: async ({topic, partition, message, heartbeat}) => {
          try {
            console.log('message received', {
              topic: topic,
              partition: partition,
              key: message.key?.toString(),
              value: message.value?.toString(),
              headers: message.headers,
              timestamp: message.timestamp
            });

            const apptileEvent: ApptileEvent = {
              topic: topic,
              message: {
                key: message.key?.toString(),
                value: JSON.parse(message.value.toString()),
                headers: message.headers,
                timestamp: message.timestamp,
                partition: partition
              }
            };
            return this.messageHandler(apptileEvent);
          } catch (e) {
            console.log('message processing failed with error', e);
          }
        }
      });
    } catch (e) {
      Promise.reject(e);
    }
  }
}
