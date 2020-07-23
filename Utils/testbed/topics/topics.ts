import { Kafka, ITopicConfig } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'test-client',
  brokers: ['kafka:9092'],
});

const admin = kafka.admin();

const connect = async () => {
  await admin.connect();
  console.log('Admin client connected.');
};

connect();

export const createTopic = async (
  topic: string = 'test-topic',
  numPartitions: number = 1,
  replicationFactor: number = 1
): Promise<void> => {
  const topicConfig: ITopicConfig = {
    topic,
    numPartitions,
    replicationFactor,
  };
  try {
    const newTopicCreated = await admin.createTopics({
      topics: [topicConfig],
    });
    console.log(
      newTopicCreated
        ? `Topic with name ${topic} was created.`
        : `Topic with name ${topic} already exists.`
    );
  } catch (err) {
    console.error(err);
  }
};

// Create a topic with multiple partitions
export const createTopicWithMultiplePartitions = (topic: string, numPartitions: number) =>
  createTopic(topic, numPartitions);

// Create a topic with multiple replicants
export const createTopicWithMultipleReplicants = (topic: string, numReplicants: number = 2) =>
  createTopic(topic, undefined, numReplicants);
