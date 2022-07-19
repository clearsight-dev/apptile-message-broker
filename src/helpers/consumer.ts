import kafkaClient from './client';
import {config} from '../config';
import {Consumer} from 'kafkajs';
import retryHelper from './retry_helper';

import {ApptileEvent, ApptileEventHandler} from '../types';
import _ from 'lodash';

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

      await retryHelper.start();

      this.topicsList = topicsList;

      const consumerConfig = {
        groupId: config.defaultGroupId,
        maxBytesPerPartition: config.maxBytesPerPartition,
        heartbeatInterval: config.heartbeatInterval,
        fromBeginning: config.fromBeginning,
        allowAutoTopicCreation: false
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
          var apptileEvent: ApptileEvent;
          // const eventGuid = message.headers?.eventGuid?.toString();
          // const requestId = message.headers?.requestId?.toString();

          try {
            var keys = message.headers ? Object.keys(message.headers) : [];
            var headers = {};
            keys.forEach(function (key) {
              headers[key] = message.headers[key]?.toString();
            });

            console.info('message received', {
              topic: topic,
              partition: partition,
              key: message.key?.toString(),
              value: message.value?.toString(),
              headers: headers,
              timestamp: message.timestamp
            });

            apptileEvent = {
              topic: topic,
              message: {
                key: message.key?.toString(),
                value: JSON.parse(message.value.toString()),
                headers: headers,
                timestamp: message.timestamp,
                partition: partition
              }
            };
          } catch (e) {
            console.error(e, 'error occurred while parsing event, ignoring the event');
            return Promise.resolve();
          }

          try {
            await this.messageHandler(apptileEvent);
          } catch (e) {
            console.error(e, 'error occurred while processing event, retrying event');
            await retryHelper.retry(apptileEvent, e);
          }
        }
      });
    } catch (e) {
      console.error(e, 'error while starting consumer');
      Promise.reject(e);
    }
  }
}
