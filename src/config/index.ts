import dotenv from 'dotenv';
dotenv.config();

export const config = {
  clientId: process.env.KAFKA_CLIENT_ID,
  brokerList: process.env.KAFKA_BROKERS_LIST || 'localhost:9092',
  maxBytesPerPartition:
    (process.env.FETCH_MESSAGE_MAX_BYTES ? parseInt(process.env.FETCH_MESSAGE_MAX_BYTES) : null) ||
    10485760,
  partitionsConsumedConcurrently:
    (process.env.KAFKA_PARTITIONS_CONSUMED_CONCURRENTLY
      ? parseInt(process.env.KAFKA_PARTITIONS_CONSUMED_CONCURRENTLY)
      : null) || 5,
  heartbeatInterval:
    (process.env.HEARTBEAT_INTERVAL ? parseInt(process.env.HEARTBEAT_INTERVAL) : null) || 6000,
  commitInterval:
    (process.env.COMMIT_INTERVAL ? parseInt(process.env.COMMIT_INTERVAL) : null) || 5000,
  // loggerLevel:
  //   (process.env.LOGGER_LEVEL ? logLevel[parseInt(process.env.LOGGER_LEVEL)] : null) ||
  //   logLevel.INFO,
  defaultGroupId: process.env.DEFAULT_GROUP_ID,
  fromBeginning: process.env.FROM_BEGINNING || true,
  failedEventNumRetryAttempts:
    (process.env.FAILED_EVENT_NUM_RETRY_ATTEMPTS
      ? parseInt(process.env.FAILED_EVENT_NUM_RETRY_ATTEMPTS)
      : null) || 3,
  retryBackoffDelay:
    (process.env.RETRY_BACKOFF_DELAY ? parseInt(process.env.RETRY_BACKOFF_DELAY) : null) || 5000,
  acks: (process.env.ACKS ? parseInt(process.env.ACKS) : null) || -1,
  failedEventsTopic: process.env.FAILED_EVENTS_TOPIS || 'apptile_failed_events_topic'
};

console.log(`Config: ${JSON.stringify(config)}`);
