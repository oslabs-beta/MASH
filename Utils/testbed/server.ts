import * as express from 'express';
import * as path from 'path';
const app = express();

import { createServer } from 'http';
const server = createServer(app);
const io = require('socket.io')(server);

import { produce, ProduceRequest, ProduceResponse } from './producer/producer';
import { consume } from './consumer/consumer';

io.on('connection', () => console.log('Socket server connected...'));
io.on('connect', (socket: any) => {
  socket.on('produce', (data: ProduceRequest) => {
    // should run the produce function data.messagesCount amount of times
    let { messagesCount } = data;
    while (messagesCount) {
      // should send back the data on completion of each to show on the client side
      produce()
        .then((resp: ProduceResponse) => socket.emit('produceResponse', resp))
        .catch(console.error);
      messagesCount--;
    }
  });
  socket.on('consume', () => consume(socket));
});

const PORT = 2022;

app.get('/main.js', (req, res) => res.sendFile(path.resolve(__dirname, '../test-front/main.js')));
app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, './index.html')));

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
