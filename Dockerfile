FROM node:lts-alpine

RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn set version stable

COPY build /app/build
COPY public /app/public


WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["yarn", "dlx", "@remix-run/serve", "build"]