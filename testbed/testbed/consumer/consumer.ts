import { Kafka, EachMessagePayload } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-consumer',
  brokers: ['kafka:9092'],
});

let count = 0;

const consumer = kafka.consumer({ groupId: 'test-group' });
consumer.subscribe({ topic: 'test-topic' });
export interface ConsumeRequest {
  messagesCount: number;
}

export interface ConsumeResponse {
  message: {
    value: {
      name: string;
      quote: string;
      image_url: string;
    };
  };
}

const randomLetter = (): string => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  return letters[Math.floor(Math.random() * letters.length)];
};

const randomGroupName = (): string => Array(9).fill('a').map(randomLetter).join('');

export const consume = async (socket: any, topic: string = 'test-topic') => {
  const consumer = kafka.consumer({ groupId: randomGroupName() });
  consumer.subscribe({ topic, fromBeginning: true });
  await consumer.run({
    eachMessage: async (payload: EachMessagePayload) => {
      const { message } = payload;
      socket.emit('consumeResponse', message.value.toString());
    },
  });
};

export const consumeAtRate = async (socket: any, rate: number, topic: string) => {
  try {
    const ratedConsumer = kafka.consumer({ groupId: randomGroupName() });
    await ratedConsumer.connect();
    await ratedConsumer.subscribe({ topic });
    await ratedConsumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { value } = payload.message;
        socket.emit('ratedConsumeResponse', value.toString());
        ratedConsumer.pause([{ topic }]);
        setTimeout(() => ratedConsumer.resume([{ topic }]), Math.floor(1000 / rate));
      },
    });
  } catch (err) {
    console.error('rated consumer error:', err);
  }
};
