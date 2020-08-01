import * as io from 'socket.io-client';
import {
  sendConsumeAtRateSignal,
  sendConsumeSignal,
  sendOverloadPartitionSignal,
  sendProduceAtRateSignal,
  sendProduceSignal,
  sendUnderReplicateSignal,
} from './socketEvents';

const socket = io();
let consumeCount = 0;
let produceCount = 0;
socket.on('connect', () => {
  console.log('socket connected');
});

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
const sendOverloadPartitionButton = document.getElementById('OverloadPartition-button');
const sendProduceAtRateButton = document.getElementById('produceRate-button');
const sendConsumeAtRateButton = document.getElementById('consumeRate-button');
const sendUnderReplicateButton = document.getElementById('underReplicate-button');

produceButton.addEventListener('click', () => {
  const inputField = document.getElementById('message-num') as HTMLInputElement;
  const numMessages = inputField.value;
  const topicField = document.getElementById('produce-topic') as HTMLInputElement;
  const topic = topicField.value;
  sendProduceSignal(socket, topic, +numMessages);
  inputField.value = '';
});

consumeButton.addEventListener('click', () => {
  const inputField = document.getElementById('consume-input') as HTMLInputElement;
  const topic = inputField.value;
  inputField.value = '';
  sendConsumeSignal(socket, topic);
});

sendOverloadPartitionButton.addEventListener('click', () => {
  const inputField = document.getElementById('OverloadPartition') as HTMLInputElement;
  const topic = inputField.value;
  sendOverloadPartitionSignal(socket, topic);
  inputField.value = '';
});

sendProduceAtRateButton.addEventListener('click', () => {
  const inputField = document.getElementById('produceRate') as HTMLInputElement;
  const numMessages = inputField.value;
  const produceTopic = document.getElementById('produceRate-topic') as HTMLInputElement;
  const topic = produceTopic.value;
  sendProduceAtRateSignal(socket, topic, +numMessages);
  inputField.value = '';
});

sendConsumeAtRateButton.addEventListener('click', () => {
  const inputString = document.getElementById('consumeRateSt') as HTMLInputElement;
  const inputNumber = document.getElementById('consumeRateNum') as HTMLInputElement;
  const stringMessages = inputString.value;
  const numberMessages = inputString.value;
  sendConsumeAtRateSignal(socket, stringMessages, +numberMessages);
  inputNumber.value = '';
});

sendUnderReplicateButton.addEventListener('click', () => {
  const inputString = document.getElementById('underReplicateSt') as HTMLInputElement;
  const inputNumber = document.getElementById('underReplicateNum') as HTMLInputElement;
  const stringMessages = inputString.value;
  const numberMessages = inputString.value;
  sendUnderReplicateSignal(socket, stringMessages, +numberMessages);
  inputNumber.value = '';
});

socket.on('consumeResponse', listConsumeResponse);
socket.on('produceResponse', listProduceResponse);
