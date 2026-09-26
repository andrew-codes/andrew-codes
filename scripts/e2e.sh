#!/usr/bin/env bash
# Builds the site, serves the static output, waits for it to respond, then
# runs the Cypress suite against it. Reproduces production rendering more
# faithfully than the Vite dev server (see CLAUDE.md's "Rendering Model"
# section: this app is prerendered at build time with ssr:false, and the dev
# server's per-request SSR is not representative of that).
set -euo pipefail

cd "$(dirname "$0")/.."

yarn build

yarn e2e:serve &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

URL="http://localhost:4173"
for _ in $(seq 1 60); do
  if curl -sf "$URL" >/dev/null 2>&1; then
    yarn cy:run
    exit $?
  fi
  sleep 1
done

echo "Timed out waiting for $URL to respond" >&2
exit 1
