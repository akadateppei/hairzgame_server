FROM node:12.4.0-alpine
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/+sources.list.d/yarn.list
RUN apt-get update && apt-get install yarn
RUN apk add --no-cache yarn
RUN yarn add express
RUN yarn add socketio

CMD [ "node", "server.js" ]

WORKDIR /app