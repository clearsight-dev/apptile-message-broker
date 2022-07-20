// @ts-ignore
import {ApptileEventConsumer, ApptileEventProducer, ApptileEvent} from '.';

// @ts-ignore
// import ApptileEventProducer from './helpers/producer';

// @ts-ignore
const apptileEventConsumer = new ApptileEventConsumer();

// @ts-ignore
const apptileEventProducer = new ApptileEventProducer();
// @ts-ignore

const usedTopic = 'apptile_app_user_onboarded';

// @ts-ignore
async function producerRun() {
  await apptileEventProducer.start();
  for (var i = 0; i < 1; i++) {
    const apptileEvent: ApptileEvent = {
      topic: usedTopic,
      message: {
        value: {
          eventName: usedTopic,
          eventData: {
            appId: 'app-id-' + i,
            userId: 'user-id-' + i,
            index: i
          }
        }
      }
    };

    await apptileEventProducer.produce(apptileEvent);
  }

  await consumerRun();
}

// @ts-ignore
async function consumerRun() {
  await apptileEventConsumer.start([usedTopic], (apptileEvent) => {
    console.log(JSON.stringify(apptileEvent));
    return Promise.reject();
  });
}

producerRun();
