import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { ControlPanel } from './ControlPanel';

export const plugin = new PanelPlugin<SimpleOptions>(ControlPanel).setPanelOptions(builder => {
  return builder.addTextInput({
    path: 'text',
    name: 'Kafka Cluster Port',
    description: 'Port of your running Kafka Instance',
    defaultValue: 'kafka:9092',
  });
});
