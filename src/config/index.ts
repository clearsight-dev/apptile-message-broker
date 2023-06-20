import dotenv from 'dotenv';
import {logger} from '../apptile-common';
dotenv.config();

export interface IConsumerConfig {
  groupId?: string;
  retryEventsTopic?: string;
  maxBytesPerPartition?: number;
  heartbeatInterval?: number;
  commitInterval?: number;
  fromBeginning?: boolean;
  partitionsConsumedConcurrently?: number;
  retryBackoffDelay?: number;
  failedEventNumRetryAttempts?: number;
  failedEventsTopic?: string;
}

export interface IProducerConfig {
  acks: number;
}

export interface IKafkaConfig {
  clientId: string;
  brokerList: string;
  consumerConfig: IConsumerConfig;
  producerConfig: IProducerConfig;
}

export const config: IKafkaConfig = {
  clientId: process.env.AMB_KAFKA_CLIENT_ID,
  brokerList: process.env.AMB_KAFKA_BROKERS_LIST || 'localhost:9092',
  consumerConfig: {
    maxBytesPerPartition:
      (process.env.AMB_KAFKA_FETCH_MESSAGE_MAX_BYTES
        ? parseInt(process.env.AMB_KAFKA_FETCH_MESSAGE_MAX_BYTES)
        : null) || 10485760,
    partitionsConsumedConcurrently:
      (process.env.AMB_KAFKA_PARTITIONS_CONSUMED_CONCURRENTLY
        ? parseInt(process.env.AMB_KAFKA_PARTITIONS_CONSUMED_CONCURRENTLY)
        : null) || 5,
    heartbeatInterval:
      (process.env.AMB_KAFKA_HEARTBEAT_INTERVAL
        ? parseInt(process.env.AMB_KAFKA_HEARTBEAT_INTERVAL)
        : null) || 6000,
    commitInterval:
      (process.env.AMB_KAFKA_COMMIT_INTERVAL
        ? parseInt(process.env.AMB_KAFKA_COMMIT_INTERVAL)
        : null) || 5000,
    // loggerLevel:
    //   (process.env.LOGGER_LEVEL ? logLevel[parseInt(process.env.LOGGER_LEVEL)] : null) ||
    //   logLevel.INFO,
    groupId: process.env.AMB_KAFKA_DEFAULT_GROUP_ID,
    fromBeginning: process.env.AMB_KAFKA_FROM_BEGINNING
      ? process.env.AMB_KAFKA_FROM_BEGINNING === 'true'
      : true,
    failedEventNumRetryAttempts:
      (process.env.FAILED_EVENT_NUM_RETRY_ATTEMPTS
        ? parseInt(process.env.FAILED_EVENT_NUM_RETRY_ATTEMPTS)
        : null) || 3,
    retryBackoffDelay:
      (process.env.AMB_KAFKA_RETRY_BACKOFF_DELAY
        ? parseInt(process.env.AMB_KAFKA_RETRY_BACKOFF_DELAY)
        : null) || 5000,
    retryEventsTopic: process.env.AMB_KAFKA_CONSUMER_RETRY_EVENTS_TOPIC,
    failedEventsTopic: process.env.AMB_KAFKA_FAILED_EVENTS_TOPIC || 'apptile_failed_events_topic'
  },
  producerConfig: {
    acks: (process.env.AMB_KAFKA_ACKS ? parseInt(process.env.AMB_KAFKA_ACKS) : null) || -1
  }
};

logger.debug(`Config: ${JSON.stringify(config)}`);
