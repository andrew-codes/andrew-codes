ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-slim AS base
RUN corepack enable
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

RUN apt-get update -qq && apt-get install -y ca-certificates yq

WORKDIR /app
# Copy built application
COPY --from=build /app/dist /app/
COPY --from=build /app/.yarn .yarn
COPY --from=build /app/.yarnrc.yml .yarnrc.yml
COPY --from=build /app/package.json package.json
COPY --from=build /app/yarn.lock yarn.lock
# Switch to node-modules linker so Node's native ESM resolver works without PnP
RUN corepack enable && \
    yq -i '.nodeLinker = "node-modules"' .yarnrc.yml && \
    yq -i 'del(.enableGlobalCache)' .yarnrc.yml && \
    yarn workspaces focus --production

WORKDIR /app
CMD ["node", "index.js" ]
