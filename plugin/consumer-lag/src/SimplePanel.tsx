import React from 'react';
import { PanelProps, PanelData, DataFrame } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';

interface Props extends PanelProps<SimpleOptions> {}

interface ConsumerData {
  topic: string;
  offset: number;
  consumergroup: string;
}

interface TopicData {
  topic: string;
  partition: number;
  children: ConsumerData[];
  offset: number;
}

const getLastElement = (arr: number[]) => arr[arr.length - 1];

/* for each producer/topic, create a bar with the length of the producer offset:
      filter by name.includes('kafka_topic_partition_current_offset')
      create an object with the relevant topic, add data from partition (partition, and topic_offset)
  */

const filterTopic = (data: PanelData) => {
  return data.series

    .filter(series => series.name?.includes('kafka_topic_partition_current_offset'))
    .filter(series => (series.fields[1].labels ? series.fields[1].labels.topic !== '__consumer_offsets' : false));
};

const getTopicData = (series: DataFrame[]): TopicData[] => {
  return series.map(s => {
    const { topic, partition } = s.fields[1].labels;
    const children: ConsumerData[] = [];
    const offset = getLastElement(s.fields[1].values.toArray());
    return {
      topic,
      partition,
      children,
      offset,
    };
  });
};

/* for each consumer/topic, create a bar on top of the producer bar with the length of the consumer offset:
      filter by name.includes('kafka_consumergroup_current_offset')
      find the partition object with the matching topic and partition
      add to "children" array consumer group name and offset      
  */

const filterConsumers = (data: PanelData) => {
  return data.series.filter(series => series.name?.includes('kafka_consumergroup_current_offset'));
};

const getConsumerData = (series: DataFrame[]): ConsumerData[] => {
  return series.map(s => {
    const { topic, consumergroup } = s.fields[1].labels;
    const offset = getLastElement(s.fields[1].values.toArray());
    return {
      topic,
      offset,
      consumergroup,
    };
  });
};

const attachConsumerToTopic = (topic: TopicData[], consumer: ConsumerData[]) => {
  consumer.forEach(c => {
    const selected = topic.filter(v => v.topic === c.topic)[0];
    console.log('consumer for selection: ', c);
    console.log('topic for selection: ', topic);
    console.log('selected: ', selected);
    selected.children.push(c);
  });
};

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const theme = useTheme();
  const styles = getStyles();
  console.log(data);

  let topics = filterTopic(data);
  let topicsData = getTopicData(topics);
  let consumers = filterConsumers(data);
  let consumersData = getConsumerData(consumers);
  attachConsumerToTopic(topicsData, consumersData);

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
      {/* for each consumer/topic, on hover / click, expand the bar and add data*/}
      {topicsData
        .map(
          topic =>
            topic.topic +
            ' - ' +
            topic.offset +
            ' : ' +
            topic.children.map(child => child.consumergroup + ' - ' + child.offset).join(', ')
        )
        .map(s => (
          <div>{s}</div>
        ))}
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
