const io = require('socket.io-client');
const http = require('http');
const ioBack = require('socket.io');
const { connect } = require('net');
// const formatMessage = require('../utils/messages');

let socket;
let httpServer;
let httpServerAddr;
let ioServer;
// const testMsg = 'Admin';

/**
 * Setup WS & HTTP servers
 */
beforeAll((done) => {
  httpServer = http.createServer().listen();

  httpServerAddr = httpServer.address();

  ioServer = ioBack(httpServer);
  done();
});

/**
 *  Cleanup WS & HTTP servers
 */
afterAll((done) => {
  ioServer.close();
  httpServer.close();
  done();
});

/**
 * Run before each test
 */
beforeEach((done) => {
  // Setup
  // Do not hardcode server port and address, square brackets are used for IPv6
  socket = io.connect(
    `http://[${httpServerAddr.address}]:${httpServerAddr.port}`,
    {
      'reconnection delay': 0,
      'reopen delay': 0,
      'force new connection': true,
      transports: ['websocket'],
    }
  );

  // console.log(socket);

  socket.on('connect', () => {
    done();
  });
});

/**
 * Run after each test
 */
afterEach((done) => {
  // Cleanup
  if (socket.connected) {
    socket.disconnect();
  }
  done();
});

describe('basic socket.io example', () => {
  test('should communicate', (done) => {
    // once connected, emit Hello World
    ioServer.emit('echo', 'Hello World');
    socket.once('echo', (message) => {
      // Check that the message matches
      expect(message).toBe('Hello World');
      done();
    });
    ioServer.on('connection', (mySocket) => {
      // console.log(mySocket);
      expect(mySocket).toBeDefined();
    });
  });

  test('should communicate', (done) => {
    // once connected, emit Besik
    ioServer.emit('message1', 'Besik');
    socket.once('message1', (message) => {
      // Check that the message matches
      expect(message).toBe('Besik');
      done();
    });
    ioServer.on('connection', (mySocket) => {
      expect(mySocket).toBeDefined();
    });
  });

  test('should communicate with waiting for socket.io handshakes', (done) => {
    // Emit sth from Client do Server
    // socket.emit('message1', formatMessage(testMsg, 'Welcome to my test'));
    socket.emit('examlpe', 'some messages');
    // Use timeout to wait for socket.io server handshakes
    setTimeout(() => {
      done();
    }, 50);
  });
});
