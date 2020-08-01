FROM node:latest

COPY . /image

WORKDIR /image

RUN npm i

EXPOSE 2022

CMD ["npm", "run", "testbed"]