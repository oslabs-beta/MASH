import React, { useState } from 'react';
import { ConsumerData } from '../SimplePanel';

interface ConsumerBarProps {
	consumer: ConsumerData;
	topicXOffset: number;
	childIndex: number;
	childWidth: number;
	childHeight: number;
}

export const ConsumerBar = (props: ConsumerBarProps) => {
	const { childIndex, childWidth, topicXOffset, consumer, childHeight } = props;
	const [ isHovered, setIsHovered ] = useState(false);

	return (
		<g>
			<rect
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				x={topicXOffset + 2 + childIndex * childWidth}
				y={25}
				width={childWidth - 10 - 6}
				height={childHeight}
				fill="#0042ff"
				filter="url(#f3)"
			/>
            { isHovered && <rect x={topicXOffset + 6 + childIndex * childWidth}
                y={1} width={55} height={30} fill="#d4c4fb" rx="12" ry="12"
                fill-opacity="0.75" stroke-width="2" stroke ="#0042ff"
            />}

			<text x={topicXOffset + 8 + childIndex * childWidth} y={20} font-family="Cambria" font-size="20" font-weight="bold" fill="black" >
				{isHovered ? consumer.offset : null}
			</text>
		</g>
	);
};
