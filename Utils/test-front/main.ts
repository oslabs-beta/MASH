import * as io from 'socket.io-client';
// import { ProduceRequest, ProduceResponse } from '../testbed/producer/producer';
// import { ConsumeResponse } from '../testbed/consumer/consumer';

const socket = io();
let consumeCount = 0;
let produceCount = 0;
socket.on('connect', () => {
  console.log('socket connected');
});

const sendProduceSignal = (num: number) => {
  const data: any = {
    messagesCount: num,
  };
  socket.emit('produce', data);
};

const sendConsumeSignal = () => {
  socket.emit('consume');
};

const listProduceResponse = (data: any) => {
  produceCount++;
  const container = document.getElementById('produce-container');
  const img = document.getElementById('produce-img');
  container.innerText = `PRODUCED: ${produceCount} - ${data.value.name}: ${data.value.quote}`;
  container.style.backgroundColor = '#' + produceCount.toString(16).padStart(6, '0');
  img.setAttribute('src', data.value.image_url);
};

const listConsumeResponse = async (data: any) => {
  data = await JSON.parse(data);
  consumeCount++;
  const container = document.getElementById('consume-container');
  const img = document.getElementById('consume-img');
  container.innerText = ` CONSUMED: ${consumeCount} - ${data.name}: ${data.quote}`;
  container.style.backgroundColor = '#' + consumeCount.toString(16).padStart(6, '0');
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
