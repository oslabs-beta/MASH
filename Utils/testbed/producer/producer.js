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
exports.produceToPartition = exports.produceAtRateToPartition = exports.produce = exports.produceAtRate = void 0;
var kafkajs_1 = require("kafkajs");
var kafka = new kafkajs_1.Kafka({
    clientId: 'test-producer',
    brokers: ['kafka:9092']
});
var count = 0;
var producer = kafka.producer();
var connect = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, producer.connect()];
            case 1:
                _a.sent();
                console.log('producer connected.');
                return [2 /*return*/];
        }
    });
}); };
connect();
exports.produceAtRate = function (rate) { return setInterval(exports.produce, Math.floor(1000 / rate)); };
exports.produce = function () {
    return new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
        var message, stringMessage, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    message = {
                        key: 'key' + count++,
                        value: {
                            name: 'me',
                            quote: 'hello',
                            image_url: 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/joypixels/257/smiling-face-with-sunglasses_1f60e.png'
                        }
                    };
                    stringMessage = {
                        key: message.key,
                        value: JSON.stringify(message.value)
                    };
                    return [4 /*yield*/, producer.send({
                            topic: 'test-topic',
                            messages: [stringMessage]
                        })];
                case 1:
                    _a.sent();
                    resolve(message);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    reject(new Error(err_1));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
};
exports.produceAtRateToPartition = function (topic, partition, rate) {
    if (partition === void 0) { partition = 0; }
    return setInterval(function () { return exports.produceToPartition(topic, partition); }, Math.floor(1000 / rate));
};
exports.produceToPartition = function (topic, partition) {
    if (partition === void 0) { partition = 0; }
    return __awaiter(void 0, void 0, void 0, function () {
        var message, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    message = {
                        value: 'Besik',
                        partition: partition
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, producer.send({ topic: topic, messages: [message] })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.error('error sending to specific partition', err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
};
//# sourceMappingURL=producer.js.map