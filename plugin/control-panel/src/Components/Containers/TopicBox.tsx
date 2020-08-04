import React from 'react';

interface TopicBoxProps {
  topic: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
}
export const TopicBox = (props: TopicBoxProps) => {
  const { topic, setTopic } = props;
  return (
    <div
      style={{
        border: '2px solid white',
        margin: '0 0.5rem 0 0.5rem',
        padding: '0.5rem',
        display: 'flex',
        minWidth: '15%',
        flexWrap: 'wrap',
        textAlign: 'center',
      }}
      onClick={() => setTopic(topic)}
    >
      {topic}
    </div>
  );
};
