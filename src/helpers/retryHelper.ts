import _ from 'lodash';
import {IConsumerConfig} from '../config';
import {constants} from '../constants/constants';
import {ApptileEvent, NonRetryableError} from '../types';
import ApptileEventProducer from './producer';
import {logger} from '../apptile-common';

class RetryHelper {
  readonly kafkaProducer: ApptileEventProducer;

  constructor() {
    this.kafkaProducer = new ApptileEventProducer();
  }

  async start(consumerConfig: IConsumerConfig) {
    if (!consumerConfig.retryEventsTopic) {
      Promise.reject(
        'Cannot start without a consumer specific retry topic. Please set env variable AMB_KAFKA_CONSUMER_RETRY_EVENTS_TOPIC'
      );
    }

    await this.kafkaProducer.start();
  }

  async retry(event: ApptileEvent, consumerConfig: IConsumerConfig, error: Error) {
    event.message.partition = null;
    if (error && error instanceof NonRetryableError) {
      logger.debug('error is NonRetryable, pushing the event to failed queue');
      event.topic = consumerConfig.failedEventsTopic;
      this.kafkaProducer.produce(event);
    } else {
      logger.debug('pushing the event to retry queue for retrying');
      event.message.headers = event.message.headers || {};

      var num = parseInt(event.message.headers.retryAttempts || '0');
      var retryAttemptsHappened = isNaN(num) ? 0 : num;

      if (retryAttemptsHappened >= consumerConfig.failedEventNumRetryAttempts) {
        logger.debug('max number of retry attempts reached, pushing the event to failed queue');
        event.topic = consumerConfig.failedEventsTopic;
        await this.kafkaProducer.produce(event);
      } else {
        event.message.headers.retryAttempts = (retryAttemptsHappened + 1).toString();
        event.message.headers.retryBackoffDelay = consumerConfig.retryBackoffDelay.toString();
        event.message.headers.retryTopic =
          event.message.headers.retryTopic || consumerConfig.retryEventsTopic;
        event.topic = constants.RETRY_EVENTS_TOPIC_FOR_BACKOFF_SCHEDULING;
        await this.kafkaProducer.produce(event);
      }
    }
  }
}

export default new RetryHelper();
