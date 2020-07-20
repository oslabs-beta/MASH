import { Kafka, EachMessagePayload } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-producer',
  brokers: ['localhost:9092'],
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

export const consume = async (socket: any) => {
  await consumer.run({
    eachMessage: async (payload: EachMessagePayload) => {
      const { message } = payload;
      console.log(count++);
      socket.emit('consumeResponse', message.value.toString());
    },
  });
};
