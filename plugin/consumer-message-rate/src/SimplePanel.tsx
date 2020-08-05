import React from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';

import * as stats from 'stats-lite';

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
  stdev: number;
}

// takes in an array of consumer offsets, spaced at 30 seconds apart
const getMessagingRate = (array: number[]): number[] => {
  const rateResponse: number[] = [1];
  for (let i = 1; i < array.length; i++) {
    rateResponse[i] = array[i] - array[i - 1]; // 10 - 300 = 241   // [555, 990, 1000]
  }
  return rateResponse;
};

const getQuarters = (array: number[]): MessagingRateQuarters => {
  array = array.sort((a, b) => a - b).filter(x => x > 1);

  let bottomMid;
  let topMid;
  if (array.length % 2 !== 0) {
    topMid = Math.floor(array[array.length / 2 + 1]);
    bottomMid = Math.floor(array[array.length / 2]);
  } else {
    topMid = array[array.length / 2];
    bottomMid = array[array.length / 2 - 1];
  }

  const response: MessagingRateQuarters = {
    top: array[array.length - 1] || 0,
    topMid: topMid || 0,
    bottomMid: bottomMid || 0,
    bottom: array[0] || 0,
    stdev: Math.floor(stats.stdev(array)),
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
  // console.log(data.series);
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
      <svg
        height={height}
        width={width}
        className={css`
          g text {
            display: none;
          }
          ,
          g:hover text {
            display: block;
            font-size: 25px;
            font-weight: bold;
          }
        `}
      >
        {data.series
          .map(series =>
            getQuarters(getMessagingRate(series.fields[1].values.toArray().filter(x => x < 30000)).reverse())
          )
          .map(group => {
            maxHeight = Math.max(group.top, maxHeight);
            return group;
          })
          .map((consumergroup, i) => {
            xOffset = Math.floor(width / data.series.length) * i;
            return (
              <g>
                <defs>
                  <filter id="f1" x="0" y="0" width="200%" height="200%">
                    <feOffset result="offOut" in="SourceGraphic" dx="2" dy="5" />
                    <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                  </filter>
                </defs>
                {/* <defs>
                  <filter id="f1" x="0" y="0">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="15" />
                  </filter>
                </defs> */}
                <rect
                  x={xOffset}
                  y={height * (consumergroup.topMid / maxHeight)}
                  height={height * (consumergroup.top / maxHeight) - height * (consumergroup.topMid / maxHeight)}
                  width={Math.floor((width / data.series.length) * 0.8)}
                  fill={getColor(i, data.series.length)}
                  stroke="grey"
                  stroke-width="3"
                  filter="url(#f1)"
                />
                <rect
                  x={xOffset}
                  y={height * (consumergroup.bottomMid / maxHeight)}
                  height={height * (consumergroup.topMid / maxHeight) - height * (consumergroup.bottomMid / maxHeight)}
                  width={Math.floor((width / data.series.length) * 0.8)}
                  fill={getColor(i + 0.25, data.series.length)}
                  stroke="grey"
                  stroke-width="3"
                  filter="url(#f1)"
                />
                <rect
                  x={xOffset}
                  y={height * (consumergroup.bottom / maxHeight)}
                  height={height * (consumergroup.bottomMid / maxHeight) - height * (consumergroup.bottom / maxHeight)}
                  width={Math.floor((width / data.series.length) * 0.8)}
                  fill={getColor(i + 0.5, data.series.length)}
                  stroke="grey"
                  stroke-width="3"
                  filter="url(#f1)"
                />
                <rect
                  x={xOffset}
                  y={0}
                  height={height * (consumergroup.bottom / maxHeight)}
                  width={Math.floor((width / data.series.length) * 0.8)}
                  fill={getColor(i + 0.75, data.series.length)}
                  stroke="grey"
                  stroke-width="3"
                  filter="url(#f1)"
                />
                <svg>
                  <g>
                    <text x={xOffset} y={230} fill="blue">
                      {`BOTT ${consumergroup.bottom}`}
                    </text>
                    <text x={xOffset} y={260} fill="pink">
                      {`BMD ${consumergroup.bottomMid}`}
                    </text>
                    <text x={xOffset} y={290} fill="yellow">
                      {`TMD ${consumergroup.topMid}`}
                    </text>
                    <text x={xOffset} y={320} fill="white">
                      {`TOP ${consumergroup.top}`}
                    </text>
                    <text x={xOffset} y={350} fill="red">
                      {`STDEV ${consumergroup.stdev}`}
                    </text>
                  </g>
                </svg>
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
