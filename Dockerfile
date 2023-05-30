ARG NODE_VERSION=18.15.0
FROM node:${NODE_VERSION}-slim as base
RUN corepack enable
RUN corepack prepare yarn@3.5.0 --activate
RUN yarn set version 3.5.0
LABEL fly_launch_runtime="Remix"

FROM base as build
ENV NODE_ENV="production"
RUN apt-get update -qq && apt-get install -y python-is-python3 pkg-config build-essential
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn run build

# Final stage for app image
FROM base
ENV NODE_ENV="production"
ENV INTERNAL_PORT="8080"
ENV PRIMARY_REGION="iad"
ENV FLY="true"
ENV LITEFS_DIR="/litefs"
ENV CACHE_DATABASE_FILENAME="cache.db"
ENV CACHE_DATABASE_PATH="/$LITEFS_DIR/$CACHE_DATABASE_FILENAME"

RUN echo "#!/bin/sh\nset -x\nsqlite3 \$CACHE_DATABASE_PATH" >/usr/local/bin/cache-database-cli && chmod +x /usr/local/bin/cache-database-cli

RUN apt-get update -qq && apt-get install -y fuse3 ca-certificates

WORKDIR /app
# Copy built application
COPY --from=build /app/dist /app/dist
COPY --from=build /app/index.js /app/index.js
COPY --from=build /app/start.js /app/start.js
COPY --from=build /app/.yarn /app/.yarn
COPY --from=build /app/.pnp.cjs /app/.pnp.cjs
COPY --from=build /app/.pnp.loader.mjs /app/.pnp.loader.mjs
COPY --from=build /app/package.json.js /app/package.json

COPY --from=flyio/litefs /usr/local/bin/litefs /app/litefs
ADD ./litefs.yml /etc/litefs.yml
RUN mkdir -p /data ${LITEFS_DIR} ${APP_STAGING_DIR}

RUN yarn install

ARG PR_NUMBER
ENV PR_NUMBER=${PR_NUMBER}
ENV APP_STAGING_DIR="/data/litefs/apps"
COPY --from=build /app/scripts/stage-app.ts /app/scripts/stage-app.ts

# Start the server by default, this can be overwritten at runtime
CMD ["yarn", "node", "start.js" ]
