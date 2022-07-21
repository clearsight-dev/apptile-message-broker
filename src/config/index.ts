import dotenv from 'dotenv';
dotenv.config();

export const config = {
  clientId: process.env.AMB_KAFKA_CLIENT_ID,
  brokerList: process.env.AMB_KAFKA_BROKERS_LIST || 'localhost:9092',
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
  defaultGroupId: process.env.AMB_KAFKA_DEFAULT_GROUP_ID,
  fromBeginning: process.env.AMB_KAFKA_FROM_BEGINNING || true,
  failedEventNumRetryAttempts:
    (process.env.FAILED_EVENT_NUM_RETRY_ATTEMPTS
      ? parseInt(process.env.FAILED_EVENT_NUM_RETRY_ATTEMPTS)
      : null) || 3,
  retryBackoffDelay:
    (process.env.AMB_KAFKA_RETRY_BACKOFF_DELAY
      ? parseInt(process.env.AMB_KAFKA_RETRY_BACKOFF_DELAY)
      : null) || 5000,
  acks: (process.env.AMB_KAFKA_ACKS ? parseInt(process.env.AMB_KAFKA_ACKS) : null) || -1,
  retryEventsTopic: process.env.AMB_KAFKA_CONSUMER_RETRY_EVENTS_TOPIC,
  failedEventsTopic: process.env.AMB_KAFKA_FAILED_EVENTS_TOPIC || 'apptile_failed_events_topic'
};

console.log(`Config: ${JSON.stringify(config)}`);
