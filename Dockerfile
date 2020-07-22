FROM node:latest

COPY . /build

WORKDIR /build

RUN npm i

EXPOSE 2022

CMD ["npm", "run", "testbed"]