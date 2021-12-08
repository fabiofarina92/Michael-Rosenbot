FROM node:latest

RUN mkdir -p /usr/src/michael-rosenbot
WORKDIR /usr/src/michael-rosenbot

COPY package.json /usr/src/michael-rosenbot
RUN npm install

COPY . /usr/src/michael-rosenbot
VOLUME /data

CMD ["node", "index.js"]
