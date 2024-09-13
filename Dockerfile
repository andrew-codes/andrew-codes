ARG NODE_VERSION=22.5.0
FROM node:${NODE_VERSION}-slim AS base
RUN corepack enable
RUN corepack prepare yarn@4.4.1 --activate
RUN yarn set version 4.4.1
LABEL fly_launch_runtime="Remix"

# Build stage for app
FROM base AS build
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
RUN apt-get update -qq && apt-get install -y python-is-python3 pkg-config build-essential
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run build

# Final stage for app image
FROM base
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV INTERNAL_PORT="8080"
ENV PRIMARY_REGION="iad"
ENV FLY="true"
ENV LITEFS_DIR="/litefs"
ENV CACHE_DATABASE_FILENAME="cache.db"
ENV CACHE_DATABASE_PATH="/$LITEFS_DIR/$CACHE_DATABASE_FILENAME"

RUN echo "#!/bin/sh\nset -x\nsqlite3 \$CACHE_DATABASE_PATH" >/usr/local/bin/cache-database-cli && chmod +x /usr/local/bin/cache-database-cli

RUN apt-get update -qq && apt-get install -y fuse3 ca-certificates

COPY --from=flyio/litefs /usr/local/bin/litefs /app/litefs
ADD ./litefs.yml /etc/litefs.yml
RUN mkdir -p /data ${LITEFS_DIR}

WORKDIR /app
# Copy built application
COPY --from=build /app/dist /app/
COPY --from=build /app/.yarn .yarn
COPY --from=build /app/.yarnrc.yml .yarnrc.yml
COPY --from=build /app/.pnp.cjs .pnp.cjs
COPY --from=build /app/.pnp.loader.mjs .pnp.loader.mjs
COPY --from=build /app/package.json package.json
COPY --from=build /app/yarn.lock yarn.lock

# RUN yarn install --mode skip-build

WORKDIR /app
CMD ["yarn", "node", "index.js" ]
