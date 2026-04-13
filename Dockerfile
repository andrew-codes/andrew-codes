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

RUN apt-get update -qq && apt-get install -y fuse3 ca-certificates

WORKDIR /app
# Copy built application
COPY --from=build /app/dist /app/

# RUN yarn install --mode skip-build

WORKDIR /app
CMD ["node", "index.js" ]
