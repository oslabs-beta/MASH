import { Kafka, Message } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: ['kafka:9092'],
});

let count = 0;

const producer = kafka.producer();
export interface ProduceRequest {
  messagesCount: number;
}

export interface ProduceResponse {
  key: string;
  value: {
    name: string;
    quote: string;
    image_url: string;
  };
}
const connect = async () => {
  await producer.connect();
  console.log('producer connected.');
};
connect();

export const produceAtRate = (topic: string, rate: number) =>
  setInterval(() => produce(topic), Math.floor(1000 / rate));

export const produce = (topic: string): Promise<ProduceResponse> => {
  return new Promise(async (resolve, reject) => {
    try {
      const message: ProduceResponse = {
        key: 'key' + count++,
        value: {
          name: 'me',
          quote: 'hello',
          image_url:
            'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/257/smiling-face-with-sunglasses_1f60e.png',
        },
      };
      const stringMessage: Message = {
        key: message.key,
        value: JSON.stringify(message.value),
      };

      await producer.send({
        topic: topic,
        messages: [stringMessage],
      });
      resolve(message);
    } catch (err) {
      reject(new Error(err));
    }
  });
};

export const produceAtRateToPartition = (topic: string, partition: number = 0, rate: number) => {
  return setInterval(() => produceToPartition(topic, partition), Math.floor(1000 / rate));
};
export const produceToPartition = async (topic: string, partition: number = 0) => {
  const message: Message = {
    value: 'Besik',
    partition,
  };
  try {
    await producer.send({ topic, messages: [message] });
  } catch (err) {
    console.error('error sending to specific partition', err);
  }
};
