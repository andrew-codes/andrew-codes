FROM node:lts-alpine

RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn set version stable

WORKDIR /app

COPY package.json /app/package.json
COPY dist /app/




ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80
ENTRYPOINT ["yarn", "dlx", "@remix-run/serve", "build"]