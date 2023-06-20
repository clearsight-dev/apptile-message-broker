import kafkaClient from './client';
import {config, IConsumerConfig} from '../config';
import {Consumer} from 'kafkajs';
import retryHelper from './retryHelper';

import {ApptileEvent, ApptileEventHandler} from '../types';
import _ from 'lodash';
import {
  generateTraceId,
  logger,
  NAMESPACE_LOG_TRACE_EVENT_GUID_KEY,
  requestTracingNamespace,
  setTracingId,
  setValueInNamespace
} from '../apptile-common';

export default class ApptileEventConsumer {
  private kafkaConsumer: Consumer;
  private topicsList: string[];
  private messageHandler: ApptileEventHandler;
  private ready: boolean;
  private consumerConfig: IConsumerConfig;

  constructor(consumerConfig?: IConsumerConfig) {
    this.consumerConfig = {...config.consumerConfig, ...consumerConfig};
    this.ready = false;
  }

  async start(topicsList: string[], messageHandler: ApptileEventHandler) {
    try {
      if (this.ready) return Promise.resolve();

      if (!topicsList) return Promise.reject('Cannot start without a topic list');

      await retryHelper.start(this.consumerConfig);

      this.topicsList = topicsList;

      const consumerConfig = {
        groupId: this.consumerConfig.groupId,
        maxBytesPerPartition: this.consumerConfig.maxBytesPerPartition,
        heartbeatInterval: this.consumerConfig.heartbeatInterval,
        fromBeginning: this.consumerConfig.fromBeginning,
        allowAutoTopicCreation: false
      };

      this.kafkaConsumer = kafkaClient.consumer(consumerConfig);
      this.messageHandler = messageHandler;

      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe({topics: this.topicsList});

      await this.kafkaConsumer.run({
        autoCommit: true,
        autoCommitInterval: this.consumerConfig.commitInterval,
        partitionsConsumedConcurrently: this.consumerConfig.partitionsConsumedConcurrently,
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

            console.info(`message received on consumer group: '${this.consumerConfig.groupId}', `, {
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

          const {eventGuid, traceId} = apptileEvent.message.headers;
          const tracingId = traceId || generateTraceId();

          requestTracingNamespace.run(async () => {
            setTracingId(tracingId);
            setValueInNamespace(NAMESPACE_LOG_TRACE_EVENT_GUID_KEY, eventGuid);
            try {
              await this.messageHandler(apptileEvent);
            } catch (e) {
              logger.error('error occurred while processing event, retrying event', e);
              await retryHelper.retry(apptileEvent, this.consumerConfig, e);
            }
          });
        }
      });
    } catch (e) {
      console.error(e, 'error while starting consumer');
      Promise.reject(e);
    }
  }
}
