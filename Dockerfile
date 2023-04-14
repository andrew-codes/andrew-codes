FROM node:lts-alpine

RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn set version stable


COPY package.json /package.json
COPY .yarn /app/.yarn
COPY yarn.lock /app/yarn.lock
COPY .pnp.cjs /app .pnp.cjs
COPY .pnp.loader.mjs /app/.pnp.loader.mjs
COPY build /app/build
COPY public /app/public


WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3000
ENTRYPOINT ["yarn", "dlx", "@remix-run/serve", "build"]