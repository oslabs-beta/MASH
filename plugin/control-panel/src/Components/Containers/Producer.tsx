import React, { useState, useEffect } from 'react';
import { SocketMessages, SocketNames } from '../../types';

interface ProducerContainerProps {
  socket: SocketIOClient.Socket;
  width: number;
  topic: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  isConnected: boolean;
}

let messagesSent = 0;
let messagesReceived = 0;

const updatePercentage = (percentDone: number, setPercentDone: React.Dispatch<React.SetStateAction<number>>) => {
  messagesReceived++;
  const newPercent = (messagesReceived / messagesSent) * 100;
  if (Math.floor(newPercent) > percentDone) {
    setPercentDone(newPercent);
  }
  if (newPercent === 100) {
    setTimeout(() => setPercentDone(0), 2000);
  }
};

const handleClick = (
  topic: string,
  numMessages: number,
  socket: SocketIOClient.Socket,
  setTopic: React.Dispatch<React.SetStateAction<string>>
) => {
  const message: SocketMessages.produceNum = {
    topic,
    messagesCount: numMessages,
  };
  socket.emit(SocketNames.produceNum, message);
  messagesSent = numMessages;
  messagesReceived = 0;
};

export const ProducerContainer: React.FC<ProducerContainerProps> = props => {
  const { socket, width, topic, setTopic, isConnected } = props;
  const [numMessages, setNumMessages] = useState(1000);
  const [percentDone, setPercentDone] = useState(0);
  const handleNumMessagesChange = (e: React.ChangeEvent<HTMLInputElement>) => setNumMessages(+e.target.value);
  useEffect(() => {
    socket.on('produceResponse', () => updatePercentage(percentDone, setPercentDone));
  }, [socket]);

  return (
    <div style={{ textAlign: 'left' }}>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
        <div style={{ minWidth: '35%' }}>
          <h3>Produce Messages:</h3>
        </div>
        <input
          width="100%"
          type="text"
          style={{ marginLeft: '1rem' }}
          value={numMessages}
          onChange={handleNumMessagesChange}
        />
        {isConnected && (
          <button
            style={{ background: '#d8d9da', color: 'black' }}
            onClick={() => handleClick(topic, numMessages, socket, setTopic)}
          >
            Produce Messages
          </button>
        )}
        <div>{percentDone ? percentDone + '%' : null}</div>
      </div>
      {percentDone ? (
        <svg width={width} height="4">
          <g>
            <rect x="2" y="2" width={percentDone ? (percentDone / 100) * width : 0} height="4" fill="green" />
          </g>
        </svg>
      ) : null}
    </div>
  );
};
