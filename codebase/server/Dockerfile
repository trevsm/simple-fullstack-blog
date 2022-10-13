# Development

FROM node:16 as base

WORKDIR /home/node/app
COPY package.json yarn.lock ./
RUN yarn

COPY . .


# Production

FROM base as production
ENV NODE_PATH=./build
RUN yarn build