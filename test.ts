import {ApptileEventConsumer, ApptileEventProducer, ApptileEvent} from './src';

// @ts-ignore
// import ApptileEventProducer from './helpers/producer';

// @ts-ignore
const apptileEventConsumer = new ApptileEventConsumer();
const apptileEventProducer = new ApptileEventProducer();
// @ts-ignore
async function producerRun() {
  await apptileEventProducer.start();
  for (var i = 0; i < 1; i++) {
    const apptileEvent: ApptileEvent = {
      topic: 'apptile-app-user-onboarded',
      message: {
        value: {
          appId: 'app-id-' + i,
          userId: 'user-id-' + i,
          index: i
        }
      }
    };

    await apptileEventProducer.produce(apptileEvent);
  }

  await consumerRun();
}

// @ts-ignore
async function consumerRun() {
  await apptileEventConsumer.start(['apptile-app-user-onboarded'], (apptileEvent) => {
    return Promise.resolve();
  });
}

producerRun();
