import * as io from 'socket.io-client';
import { SocketMessages, SocketNames } from '../testbed/types/socket';

const socket = io();
let consumeCount = 0;
let produceCount = 0;
socket.on('connect', () => {
  console.log('socket connected');
});

const sendProduceSignal = (num: number) => {
  const produceNum: SocketMessages.produceNum = {
    messagesCount: num,
  };
  socket.emit(SocketNames.produceNum, produceNum);
};

const sendConsumeSignal = (topic: string) => {
  const consumeAll: SocketMessages.consumeAll = {
    topic,
  };
  socket.emit(SocketNames.consumeAll, consumeAll);
};

const sendOverloadPartitionSignal = (
  messages: number = 100,
  numPartitions: number = 2,
  topic: string = 'test-topic'
) => {
  const overload: SocketMessages.overloadPartition = {
    messages,
    numPartitions,
    topic,
  };
  socket.emit(SocketNames.overloadPartition, overload);
};

const sendProduceAtRateSignal = (rate: number) => {
  const produceAtRate: SocketMessages.produceRate = {
    rate,
  };
  socket.emit(SocketNames.produceRate, produceAtRate);
};

const sendConsumeAtRateSignal = (topic: string, rate: number) => {
  const consumeAtRate: SocketMessages.consumeRate = {
    rate,
    topic,
  };
  socket.emit(SocketNames.consumeRate, consumeAtRate);
};

const sendUnderReplicateSignal = (topic: string, numReplicants: number = 2) => {
  const sendUnderReplicate: SocketMessages.underReplicate = {
    topic,
    numReplicants,
  };
  socket.emit(SocketNames.underReplicate, sendUnderReplicate);
};

const listProduceResponse = (data: any) => {
  produceCount++;
  const container = document.getElementById('produce-container');
  const img = document.getElementById('produce-img');
  container.innerText = `PRODUCED: ${produceCount} - ${data.value.name}: ${data.value.quote}`;
  container.style.border = '2px solid ' + '#' + produceCount.toString(16).padStart(6, '0');
  img.setAttribute('src', data.value.image_url);
};

const listConsumeResponse = async (data: any) => {
  data = await JSON.parse(data);
  consumeCount++;
  const container = document.getElementById('consume-container');
  const img = document.getElementById('consume-img');
  container.innerText = ` CONSUMED: ${consumeCount} - ${data.name}: ${data.quote}`;
  container.style.border = '2px solid ' + '#' + produceCount.toString(16).padStart(6, '0');
  img.setAttribute('src', data.image_url);
};

const produceButton = document.getElementById('produce-button');
const consumeButton = document.getElementById('consume-button');

produceButton.addEventListener('click', () => {
  const inputField = document.getElementById('message-num') as HTMLInputElement;
  const numMessages = inputField.value;
  sendProduceSignal(+numMessages);
  inputField.value = '';
});

consumeButton.addEventListener('click', sendConsumeSignal);

socket.on('consumeResponse', listConsumeResponse);
socket.on('produceResponse', listProduceResponse);
