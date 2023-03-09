ARG VARIANT=16.15.1-alpine
FROM node:${VARIANT}

WORKDIR /usr/apptile-message-broker

COPY . .
RUN npm i
