"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express = require("express");
var path = require("path");
var app = express();
var http_1 = require("http");
var server = http_1.createServer(app);
var io = require('socket.io')(server);
var socket_1 = require("./types/socket");
var producer_1 = require("./producer/producer");
var consumer_1 = require("./consumer/consumer");
var topics_1 = require("./topics/topics");
io.on('connection', function () { return console.log('Socket server connected...'); });
io.on('connect', function (socket) {
    socket.on(socket_1.SocketNames.produceNum, function (data) {
        // should run the produce function data.messagesCount amount of times
        var messagesCount = data.messagesCount;
        while (messagesCount) {
            // should send back the data on completion of each to show on the client side
            producer_1.produce()
                .then(function (resp) { return socket.emit('produceResponse', resp); })["catch"](console.error);
            messagesCount--;
        }
    });
    socket.on(socket_1.SocketNames.produceRate, function (data) {
        producer_1.produceAtRate(data.rate);
    });
    socket.on(socket_1.SocketNames.consumeRate, function (data) {
        var rate = data.rate, topic = data.topic;
        consumer_1.consumeAtRate(socket, rate, topic);
    });
    socket.on(socket_1.SocketNames.overloadPartition, function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var topic, numPartitions, messages;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    topic = data.topic, numPartitions = data.numPartitions;
                    messages = data.messages;
                    return [4 /*yield*/, topics_1.createTopicWithMultiplePartitions(topic, numPartitions)];
                case 1:
                    _a.sent();
                    while (messages) {
                        // we can add in custom partitioning logic here, if needed
                        // right now, this will overload partition 0 by default
                        producer_1.produceToPartition(topic);
                        messages -= 1;
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    socket.on(socket_1.SocketNames.underReplicate, function (data) {
        var topic = data.topic, numReplicants = data.numReplicants;
        // any number of replicants greater than the number of brokers will cause an under-replication event
        // default number of brokers is 1
        // default number of replicants is 2
        topics_1.createTopicWithMultipleReplicants(topic, numReplicants);
    });
    socket.on(socket_1.SocketNames.createTopic, function (data) {
        var topic = data.topic;
        topics_1.createTopic(topic);
    });
    socket.on(socket_1.SocketNames.consumeAll, function (data) {
        var topic = data.topic;
        consumer_1.consume(socket, topic);
    });
});
var PORT = 2022;
app.get('/main.css', function (req, res) {
    return res.sendFile(path.resolve(__dirname, 'main.css'));
});
app.get('/main.js', function (req, res) {
    return res.sendFile(path.resolve(__dirname, '../test-front/main.js'));
});
app.get('/', function (req, res) {
    return res.sendFile(path.resolve(__dirname, './index.html'));
});
server.listen(PORT, function () { return console.log("Server listening on port " + PORT); });
//# sourceMappingURL=server.js.map