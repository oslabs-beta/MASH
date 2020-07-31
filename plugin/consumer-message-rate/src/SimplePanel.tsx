import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';

// what do we need?
// 1. we need the messaging rate per consumer
// 2. we need the highest message rate per (per 30 seconds)
// 3. we need the highest 25% message rate per (per 30 seconds)
// 4. we need the lowest 25%  message rate per (per 30 seconds)
// 5. we need the lowest message rate per (per 30 seconds)

interface MessagingRateQuarters {
  top: number;
  topMid: number;
  bottomMid: number;
  bottom: number;
}

// takes in an array of consumer offsets, spaced at 30 seconds apart
const getMessagingRate = (array: number[]): number[] => {
  const rateResponse: number[] = [1];
  for (let i = 1; i < array.length; i++) {
    rateResponse[i] = array[i] - array[i - 1];
  }
  return rateResponse;
};

const getQuarters = (array: number[]): MessagingRateQuarters => {
  array = array.sort().filter(x => x > 1);
  const quarterLength = Math.floor(array.length / 4);
  const response: MessagingRateQuarters = {
    top: array[array.length - 1] || 0,
    topMid: array[quarterLength * 3] || 0,
    bottomMid: array[quarterLength * 2] || 0,
    bottom: array[quarterLength] || 0,
  };
  return response;
};

const getColor = (index: number, length: number) => {
  let color = parseInt('FFFFFF', 16);
  color = Math.floor((color / length) * index);
  return `#${color.toString(16)}`;
};
interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  const styles = getStyles();
  console.log(data);
  let xOffset = 0;
  let maxHeight = 0;
  return (
    <div
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
    >
      <svg height={height} width={width}>
        {data.series
          .map(series =>
            getQuarters(getMessagingRate(series.fields[1].values.toArray().filter(x => x < 30000)).reverse())
          )
          .map(group => {
            maxHeight = Math.max(group.top, maxHeight);
            return group;
          })
          .map((consumergroup, i) => {
            xOffset += Math.floor(width / data.series.length);
            return (
              <g>
                <rect
                  x={xOffset}
                  y={height * (consumergroup.topMid / maxHeight)}
                  height={height * (consumergroup.top / maxHeight) - height * (consumergroup.topMid / maxHeight)}
                  width={Math.floor((width / data.series.length) * 0.8)}
                  fill={getColor(i, data.series.length)}
                />
                <rect
                  x={xOffset}
                  y={height * (consumergroup.bottomMid / maxHeight)}
                  height={height * (consumergroup.topMid / maxHeight) - height * (consumergroup.bottomMid / maxHeight)}
                  width={Math.floor((width / data.series.length) * 0.8)}
                  fill={getColor(i + 0.25, data.series.length)}
                />
                <rect
                  x={xOffset}
                  y={height * (consumergroup.bottom / maxHeight)}
                  height={height * (consumergroup.bottomMid / maxHeight) - height * (consumergroup.bottom / maxHeight)}
                  width={Math.floor((width / data.series.length) * 0.8)}
                  fill={getColor(i + 0.5, data.series.length)}
                />
                <rect
                  x={xOffset}
                  y={0}
                  height={height * (consumergroup.bottom / maxHeight)}
                  width={Math.floor((width / data.series.length) * 0.8)}
                  fill={getColor(i + 0.75, data.series.length)}
                />
                <text x={xOffset} y={30}>
                  {consumergroup.bottom}
                </text>
                <text x={xOffset} y={60}>
                  {consumergroup.bottomMid}
                </text>
                <text x={xOffset} y={90}>
                  {consumergroup.topMid}
                </text>
                <text x={xOffset} y={120}>
                  {consumergroup.top}
                </text>
              </g>
            );
          })}
      </svg>
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    svg: css`
      position: absolute;
      top: 0;
      left: 0;
    `,
    textBox: css`
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
    `,
  };
});
