ARG NODE_VERSION=18.15.0
FROM node:${NODE_VERSION}-slim as base
RUN corepack enable
RUN corepack prepare yarn@3.5.0 --activate
RUN yarn set version 3.5.0
LABEL fly_launch_runtime="Remix"
WORKDIR /app
ENV NODE_ENV=production

FROM base as build
RUN apt-get update -qq && \
    apt-get install -y python-is-python3 pkg-config build-essential
COPY package.json yarn.lock .
RUN yarn install
COPY . .
RUN yarn run build

# Final stage for app image
FROM base
# Copy built application
COPY --from=build /app /app
# Start the server by default, this can be overwritten at runtime
CMD [ "yarn", "remix-serve", "build" ]
