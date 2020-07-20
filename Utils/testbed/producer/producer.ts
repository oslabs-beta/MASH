import { Kafka, Message } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: ['localhost:9092'],
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
export const produce = (): Promise<ProduceResponse> => {
  return new Promise(async (resolve, reject) => {
    console.log('promise begun');
    await producer.connect();
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
        topic: 'test-topic',
        messages: [stringMessage],
      });
      resolve(message);
    } catch (err) {
      reject(new Error(err));
    }
  });
};
