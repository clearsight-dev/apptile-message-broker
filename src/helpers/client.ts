import {Kafka} from 'kafkajs';
import {config} from '../config';

class Client {
  declare readonly kafkaClient: Kafka;
  constructor() {
    const clientConfig = {
      clientId: config.clientId,
      brokers: config.brokerList.split(',')
    };
    this.kafkaClient = new Kafka(clientConfig);
  }
}

// Singleton client instance
const client = new Client();
export default client.kafkaClient;
