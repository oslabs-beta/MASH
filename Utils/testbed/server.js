'use strict';
exports.__esModule = true;
var express = require('express');
var path = require('path');
var app = express();
var http_1 = require('http');
var server = http_1.createServer(app);
var io = require('socket.io')(server);
var producer_1 = require('./producer/producer');
var consumer_1 = require('./consumer/consumer');
io.on('connection', function () {
  return console.log('Socket server connected...');
});
io.on('connect', function (socket) {
  socket.on('produce', function (data) {
    // should run the produce function data.messagesCount amount of times
    var messagesCount = data.messagesCount;
    while (messagesCount) {
      // should send back the data on completion of each to show on the client side
      producer_1
        .produce()
        .then(function (resp) {
          return socket.emit('produceResponse', resp);
        })
        ['catch'](console.error);
      messagesCount--;
    }
  });
  socket.on('consume', function () {
    return consumer_1.consume(socket);
  });
});
var PORT = 2022;
app.get('/main.js', function (req, res) {
  return res.sendFile(path.resolve(__dirname, '../test-front/main.js'));
});
app.get('/', function (req, res) {
  return res.sendFile(path.resolve(__dirname, './index.html'));
});
server.listen(PORT, function () {
  return console.log('Server listening on port ' + PORT);
});
//# sourceMappingURL=server.js.map
