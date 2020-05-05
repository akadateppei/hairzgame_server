FROM node:12.4.0-alpine

RUN apk add --no-cache yarn

CMD [ "node", "server.js" ]

WORKDIR /app