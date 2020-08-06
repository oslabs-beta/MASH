#!/bin/sh

# Build the consumer-lag plugin
cd ./plugin/consumer-lag/ && npm i && npm run build && cd ../../

# Build the consumer_message plugin
cd ./plugin/consumer-message-rate/ && npm i && npm run build && cd ../../

# Build the control-panel plugin
cd ./plugin/control-panel/ && npm i && npm run build && cd ../../

# Start the docker instance
docker-compose up
