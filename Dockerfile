FROM alpine:latest

RUN apk --no-cache add --update \
    nodejs \
    npm

WORKDIR /discordbot
COPY src package.json /discordbot/

RUN npm install

CMD ["/usr/bin/node", "bot.js"]
