import _ from 'lodash';
import {config} from '../config';
import {constants} from '../constants/constants';
import {ApptileEvent, NonRetryableError} from '../types';
import ApptileEventProducer from './producer';

class RetryHelper {
  readonly kafkaProducer: ApptileEventProducer;

  constructor() {
    this.kafkaProducer = new ApptileEventProducer();
  }

  async start() {
    if (!config.retryEventsTopic) {
      Promise.reject(
        'Cannot start without a consumer specific retry topic. Please set env variable KAFKA_CONSUMER_RETRY_EVENTS_TOPIC'
      );
    }

    await this.kafkaProducer.start();
  }

  async retry(event: ApptileEvent, error: Error) {
    event.message.partition = null;
    if (error && error instanceof NonRetryableError) {
      console.log('error is NonRetryable, pushing the event to failed queue');
      event.topic = config.failedEventsTopic;
      this.kafkaProducer.produce(event);
    } else {
      console.log('pushing the event to retry queue for retrying');
      event.message.headers = event.message.headers || {};

      var num = parseInt(event.message.headers.retryAttempts || '0');
      var retryAttemptsHappened = isNaN(num) ? 0 : num;

      if (retryAttemptsHappened >= config.failedEventNumRetryAttempts) {
        console.log('max number of retry attempts reached, pushing the event to failed queue');
        event.topic = config.failedEventsTopic;
        await this.kafkaProducer.produce(event);
      } else {
        event.message.headers.retryAttempts = (retryAttemptsHappened + 1).toString();
        event.message.headers.retryBackoffDelay = config.retryBackoffDelay.toString();
        event.message.headers.retryTopic =
          event.message.headers.retryTopic || config.retryEventsTopic;
        event.topic = constants.RETRY_EVENTS_TOPIC_FOR_BACKOFF_SCHEDULING;
        await this.kafkaProducer.produce(event);
      }
    }
  }
}

export default new RetryHelper();
