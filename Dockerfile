FROM node:lts-alpine

RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn set version stable

COPY package.json /app/package.json
COPY build /app/build
COPY public /app/public

WORKDIR /app
RUN yarn global add @remix-run/serve

ENV NODE_ENV=production
EXPOSE 80
ENTRYPOINT ['yarn' 'remix-serve' 'build']