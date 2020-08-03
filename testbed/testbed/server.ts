import * as express from 'express';
import * as path from 'path';
const app = express();

import { createServer } from 'http';
const server = createServer(app);
const io = require('socket.io')(server);

import { SocketNames, SocketMessages } from './types/socket';

import {
  produce,
  produceAtRate,
  ProduceRequest,
  ProduceResponse,
  produceToPartition,
} from './producer/producer';
import { consume, consumeAtRate } from './consumer/consumer';
import {
  createTopicWithMultiplePartitions,
  createTopicWithMultipleReplicants,
  createTopic,
} from './topics/topics';

io.on('connection', () => console.log('Socket server connected...'));
io.on('connect', (socket: any) => {
  socket.on(SocketNames.produceNum, (data: SocketMessages.produceNum) => {
    // should run the produce function data.messagesCount amount of times
    let { messagesCount, topic } = data;
    topic = topic === '' ? 'test-topic' : topic;
    let remaining = messagesCount;
    while (remaining) {
      // should send back the data on completion of each to show on the client side
      produce(topic)
        .then((resp: ProduceResponse) =>
          socket.emit('produceResponse', resp, Math.floor(1 - remaining / messagesCount) * 100)
        )
        .catch(console.error);
      messagesCount--;
    }
  });

  socket.on(SocketNames.produceRate, (data: SocketMessages.produceRate) => {
    const { topic, rate } = data;
    produceAtRate(topic, rate);
  });

  socket.on(SocketNames.consumeRate, (data: SocketMessages.consumeRate) => {
    const { rate, topic } = data;
    consumeAtRate(socket, rate, topic);
  });

  socket.on(SocketNames.overloadPartition, async (data: SocketMessages.overloadPartition) => {
    const { topic, numPartitions } = data;
    let { messages } = data;
    await createTopicWithMultiplePartitions(topic, numPartitions);
    while (messages) {
      // we can add in custom partitioning logic here, if needed
      // right now, this will overload partition 0 by default
      produceToPartition(topic);
      messages -= 1;
    }
  });

  socket.on(SocketNames.underReplicate, (data: SocketMessages.underReplicate) => {
    const { topic, numReplicants } = data;
    // any number of replicants greater than the number of brokers will cause an under-replication event
    // default number of brokers is 1
    // default number of replicants is 2
    createTopicWithMultipleReplicants(topic, numReplicants);
  });

  socket.on(SocketNames.createTopic, (data: SocketMessages.createTopic) => {
    const { topic } = data;
    createTopic(topic);
  });
  socket.on(SocketNames.consumeAll, (data: SocketMessages.consumeAll) => {
    const { topic } = data;
    console.log('consumeAll called with topic', topic);
    consume(socket, topic !== '' ? topic : undefined);
  });
});
const PORT = 2022;

app.get('/main.css', (req, res) => res.sendFile(path.resolve(__dirname, 'main.css')));
app.get('/main.js', (req, res) => res.sendFile(path.resolve(__dirname, '../test-front/main.js')));
app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, './index.html')));

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
