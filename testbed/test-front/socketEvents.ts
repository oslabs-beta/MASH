import { SocketMessages, SocketNames } from '../testbed/types/socket';

export const sendProduceSignal = (socket: SocketIOClient.Socket, topic: string, num: number) => {
  topic = topic === '' ? 'test-topic' : topic;
  const produceNum: SocketMessages.produceNum = {
    messagesCount: num,
    topic,
  };
  socket.emit(SocketNames.produceNum, produceNum);
};

export const sendConsumeSignal = (socket: SocketIOClient.Socket, topic: string) => {
  const consumeAll: SocketMessages.consumeAll = {
    topic,
  };
  socket.emit(SocketNames.consumeAll, consumeAll);
};

export const sendOverloadPartitionSignal = (
  socket: SocketIOClient.Socket,
  topic: string = 'test-topic',
  messages: number = 100,
  numPartitions: number = 2
) => {
  const overload: SocketMessages.overloadPartition = {
    messages,
    numPartitions,
    topic,
  };
  socket.emit(SocketNames.overloadPartition, overload);
};

export const sendProduceAtRateSignal = (
  socket: SocketIOClient.Socket,
  topic: string,
  rate: number
) => {
  topic = topic === '' ? 'test-topic' : topic;
  const produceAtRate: SocketMessages.produceRate = {
    rate,
    topic,
  };
  socket.emit(SocketNames.produceRate, produceAtRate);
};

export const sendConsumeAtRateSignal = (
  socket: SocketIOClient.Socket,
  topic: string,
  rate: number
) => {
  const consumeAtRate: SocketMessages.consumeRate = {
    rate,
    topic,
  };
  socket.emit(SocketNames.consumeRate, consumeAtRate);
};

export const sendUnderReplicateSignal = (
  socket: SocketIOClient.Socket,
  topic: string,
  numReplicants: number = 2
) => {
  const sendUnderReplicate: SocketMessages.underReplicate = {
    topic,
    numReplicants,
  };
  socket.emit(SocketNames.underReplicate, sendUnderReplicate);
};
