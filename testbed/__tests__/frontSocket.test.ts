import { Socket } from 'socket.io-client';

import { SocketNames } from '../testbed/types/socket';

import {
  sendConsumeAtRateSignal,
  sendConsumeSignal,
  sendOverloadPartitionSignal,
  sendProduceAtRateSignal,
  sendProduceSignal,
  sendUnderReplicateSignal,
} from '../test-front/socketEvents';

describe('front end socket test suite', () => {
  let mockSocket = {
    emit: (eventName, message) => {
      socketMessage = { eventName, message };
    },
  };
  interface Message {
    [key: string]: any;
  }

  interface SocketMessage {
    eventName: string;
    message: Message;
  }

  let socketMessage: SocketMessage = { eventName: '', message: {} };

  describe('send produce signal', () => {
    const topic = 'test-topic';
    const messagesCount = 1000;
    beforeAll(() => {
      sendProduceSignal(mockSocket as typeof Socket, topic, messagesCount);
    });

    afterAll(() => {
      socketMessage = { eventName: '', message: {} };
    });
    it('sends produce signal with the correct event name', () => {
      expect(socketMessage.eventName).toEqual(SocketNames.produceNum);
    });
    it('send the produce signal with the passed-in message', () => {
      expect(socketMessage.message).toEqual({ topic, messagesCount });
    });
    describe('produce defaults', () => {
      beforeAll(() => {
        sendProduceSignal(mockSocket as typeof Socket, '', 100);
      });

      afterAll(() => {
        socketMessage = { eventName: '', message: {} };
      });
      it("includes 'test-topic' as the default topic", () => {
        expect(socketMessage.message.topic).toEqual('test-topic');
      });
    });
  });

  describe('send consume signal', () => {
    const topic = 'test-topic';
    beforeAll(() => {
      sendConsumeSignal(mockSocket as typeof Socket, topic);
    });

    afterAll(() => {
      socketMessage = { eventName: '', message: {} };
    });
    it('sends consume signal with the correct event name', () => {
      expect(socketMessage.eventName).toEqual(SocketNames.consumeAll);
    });
    it('send the consume signal with the passed-in message', () => {
      expect(socketMessage.message).toEqual({ topic });
    });
  });
  describe('send produce at rate signal', () => {
    const topic = 'test-topic';
    const rate = 10;
    beforeAll(() => {
      sendProduceAtRateSignal(mockSocket as typeof Socket, topic, rate);
    });

    afterAll(() => {
      socketMessage = { eventName: '', message: {} };
    });
    it('sends produce at rate signal with the correct event name', () => {
      expect(socketMessage.eventName).toEqual(SocketNames.produceRate);
    });
    it('send the produce at rate signal with the passed-in message', () => {
      expect(socketMessage.message).toEqual({ topic, rate });
    });
    describe('produce at rate defaults', () => {
      beforeAll(() => {
        sendProduceAtRateSignal(mockSocket as typeof Socket, '', 100);
      });

      afterAll(() => {
        socketMessage = { eventName: '', message: {} };
      });
      it("includes 'test-topic' as the default topic", () => {
        expect(socketMessage.message.topic).toEqual('test-topic');
      });
    });
  });
  describe('send consume at rate signal', () => {
    const topic = 'test-topic';
    const rate = 10;
    beforeAll(() => {
      sendConsumeAtRateSignal(mockSocket as typeof Socket, topic, rate);
    });

    afterAll(() => {
      socketMessage = { eventName: '', message: {} };
    });
    it('sends consume at rate signal with the correct event name', () => {
      expect(socketMessage.eventName).toEqual(SocketNames.consumeRate);
    });
    it('send the consume at rate signal with the passed-in message', () => {
      expect(socketMessage.message).toEqual({ topic, rate });
    });
  });
  describe('send under replicate signal', () => {
    const topic = 'test-topic';
    const numReplicants = 10;
    beforeAll(() => {
      sendUnderReplicateSignal(mockSocket as typeof Socket, topic, numReplicants);
    });

    afterAll(() => {
      socketMessage = { eventName: '', message: {} };
    });
    it('sends under replicate signal with the correct event name', () => {
      expect(socketMessage.eventName).toEqual(SocketNames.underReplicate);
    });
    it('send the under replicate signal with the passed-in message', () => {
      expect(socketMessage.message).toEqual({ topic, numReplicants });
    });
  });
  describe('send overload partition signal', () => {
    const topic = 'testing-topic';
    const numPartitions = 10;
    const messages = 1000;
    beforeAll(() => {
      sendOverloadPartitionSignal(mockSocket as typeof Socket, topic, messages, numPartitions);
    });

    afterAll(() => {
      socketMessage = { eventName: '', message: {} };
    });
    it('sends overload partition signal with the correct event name', () => {
      expect(socketMessage.eventName).toEqual(SocketNames.overloadPartition);
    });
    it('send the overload partition signal with the passed-in message', () => {
      expect(socketMessage.message).toEqual({ topic, messages, numPartitions });
    });
    describe('overload parition defaults', () => {
      beforeAll(() => {
        sendOverloadPartitionSignal(mockSocket as typeof Socket);
      });

      afterAll(() => {
        socketMessage = { eventName: '', message: {} };
      });
      it("includes 'test-topic' as the default topic", () => {
        expect(socketMessage.message.topic).toEqual('test-topic');
      });
      it('includes 100 as the default number of messages', () => {
        expect(socketMessage.message.messages).toEqual(100);
      });
      it('includes 2 as the default number of partitions', () => {
        expect(socketMessage.message.numPartitions).toEqual(2);
      });
    });
  });
});
