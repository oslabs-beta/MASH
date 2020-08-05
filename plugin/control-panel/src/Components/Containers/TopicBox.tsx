import React, { useState } from 'react';

interface TopicBoxProps {
  topic: string;
  setTopic: React.Dispatch<React.SetStateAction<string>>;
  isSelected: boolean;
}
export const TopicBox = (props: TopicBoxProps) => {
  const { topic, setTopic, isSelected } = props;
  // const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) =>
  // setMousePosition({ x: e.clientX, y: e.clientY });

  return (
    <div
      style={{
        border: '2px solid #d8d9da',
        margin: '0.5rem',
        padding: '0.5rem',
        minWidth: '15%',
        background: isHovered || isSelected ? '#d8d9da' : 'inherit',
        color: isHovered || isSelected ? 'black' : 'inherit',
        cursor: 'pointer',
      }}
      onClick={() => setTopic(topic)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // onMouseMove={handleMouseMove}
    >
      {topic}
      {/* {isHovered && (
        <div style={{ position: 'fixed', left: mousePosition.x + 10, top: mousePosition.y + 10, background: '#fff' }}>
          {topic}
        </div>
      )} */}
    </div>
  );
};
