import React from 'react';

import { Kafka } from 'kafkajs';

interface ProduceButtonProps {
  topic: string;
  numMessages: number;
  kafkaBroker: string;
}
export const ProduceButton: React.FC<ProduceButtonProps> = (props: ProduceButtonProps) => {
  // needs to receive a topic and an amount of messages to create
  // should update the state of the button with how many messages were created
};
