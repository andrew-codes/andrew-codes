#!/usr/bin/env bash
# Builds the site, serves the static output, waits for it to respond, then
# runs the Cypress suite against it. Reproduces production rendering more
# faithfully than the Vite dev server (see CLAUDE.md's "Rendering Model"
# section: this app is prerendered at build time with ssr:false, and the dev
# server's per-request SSR is not representative of that).
set -euo pipefail

cd "$(dirname "$0")/.."

yarn build

# Pick a free port at run time so concurrent runs (other worktrees, other
# workers) never share a server. 4173 stays only as the default for a hand-run
# `cypress open` or `yarn e2e:serve`.
PORT="$(node -e 'const s=require("net").createServer().listen(0,()=>{console.log(s.address().port);s.close()})')"
URL="http://localhost:$PORT"
echo "e2e: serving build on $URL"

# --no-port-switching makes serve fail instead of silently moving to another
# port, so a taken port can never leave us testing someone else's server.
PORT="$PORT" yarn e2e:serve &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

for _ in $(seq 1 60); do
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "Static server exited before responding on $URL" >&2
    exit 1
  fi
  if curl -sf "$URL" >/dev/null 2>&1; then
    CYPRESS_BASE_URL="$URL" yarn cy:run
    exit $?
  fi
  sleep 1
done

echo "Timed out waiting for $URL to respond" >&2
exit 1
