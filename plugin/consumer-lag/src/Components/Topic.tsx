import React from 'react';
import { TopicData } from '../SimplePanel';
import { ConsumerBar } from './Consumer';

interface TopicProps {
	topic: TopicData;
	width: number;
	totalNumOfTopics: number;
	index: number;
	height: number;
}

export const TopicBar = (props: TopicProps) => {
	const { totalNumOfTopics, width, index, topic, height } = props;
	const topicWidth = width / totalNumOfTopics;
	const topicXOffset = topicWidth * index;
	const childWidth = topicWidth / topic.children.length;
	const scale = (messagesOffset: number, topicOffset: number): number =>
		(messagesOffset + 1) / (topicOffset + 1) * height;
	return (
		<g>
			<defs>
				<filter id="f3" x="0" y="0">
					<feOffset result="offOut" in="SourceAlpha" dx=".5" dy=".5" />
					<feGaussianBlur result="blurOut" in="offOut" stdDeviation="4" />
					<feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
				</filter>
			</defs>
			<rect
				x={topicXOffset}
				y={25}
				width={topicWidth - 10}
				height={scale(topic.offset, topic.offset)}
				fill="#b5c6f7"
			/>
			{topic.children.map((child, j) => (
				<ConsumerBar
					consumer={child}
					topicXOffset={topicXOffset}
					childIndex={j}
					childWidth={childWidth}
					childHeight={scale(child.offset, topic.offset)}
				/>
			))}
		</g>
	);
};
