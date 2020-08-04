import React, { useState, useEffect } from 'react';
import { SocketNames } from '../../types';
interface ConsumerContainerProps {
  socket: SocketIOClient.Socket;
  width: number;
  topic: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
}

let messages = 0;

export const ConsumerContainer: React.FC<ConsumerContainerProps> = props => {
  const { socket, width, topic, setTopic } = props;
  const [consumedMessages, setConsumedMessages] = useState(0);
  const handleClick = () => {
    socket.emit(SocketNames.consumeAll, { topic });
    messages = 0;
    setConsumedMessages(0);
  };
  useEffect(() => {
    socket.on('consumeResponse', () => {
      setConsumedMessages(messages++);
    });
  }, [socket]);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'start' }}>
        <h3 style={{ textAlign: 'start', minWidth: '35vw' }}>Consume Messages:</h3>
        <button style={{ display: 'block', color: 'black', marginLeft: '1rem' }} onClick={handleClick}>
          Consume All
        </button>
        <div style={{ display: 'block', paddingLeft: '1rem', paddingRight: '1rem' }}></div>
        <div style={{ display: 'block' }}>{consumedMessages ? consumedMessages + ' messages consumed' : null}</div>
      </div>
    </div>
  );
};
