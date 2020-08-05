import React, { useState } from 'react';

interface TopicBoxProps {
  topic: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
}
export const TopicBox = (props: TopicBoxProps) => {
  const { topic, setTopic } = props;
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      style={{
        border: '2px solid #d8d9da',
        margin: '0.5rem',
        padding: '0.5rem',
        minWidth: '15%',
        background: isHovered ? '#d8d9da' : 'inherit',
        color: isHovered ? 'black' : 'inherit',
        cursor: 'pointer',
      }}
      onClick={() => setTopic(topic)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {topic}
    </div>
  );
};
