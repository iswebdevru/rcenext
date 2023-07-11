FROM node:18.16.0-alpine

# See https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --package-lock-only

RUN npm ci

COPY . .

ENTRYPOINT [ "sh", "./startup.sh" ]