#!/usr/bin/env bash
#
# GoLo one-command redeploy. Run on the VPS from the project root:
#   npm run deploy          # pull, install, build, reload
#   npm run deploy -- --db  # also sync the database schema (only if it changed)
#
set -euo pipefail

# Where the reloaded app is expected to answer, and how long to wait for it.
# The port must match `env.PORT` in ecosystem.config.js.
HEALTH_URL="http://localhost:${PORT:-3000}/api/health"
HEALTH_RETRIES=30

# Always run from the repo root, regardless of where this is invoked.
cd "$(dirname "$0")/.."

echo "==> Pulling latest from GitHub"
git pull --ff-only

echo "==> Installing dependencies"
npm ci

echo "==> Building"
npm run build

if [[ "${1:-}" == "--db" ]]; then
  echo "==> Syncing database schema"
  npm run db:push
fi

echo "==> Reloading app (PM2, zero-downtime)"
pm2 startOrReload ecosystem.config.js --update-env

# PM2 returns once it has SPAWNED the process, not once Next is listening, so a
# single probe here races the server and usually loses — locally Next needs
# ~300 ms to report Ready, and a cold VPS takes longer. Under `set -e` that lost
# race exited non-zero and failed the whole deploy while the app was in fact
# coming up fine. Poll instead, and only call it a failure once the app has had
# a fair chance to answer.
echo "==> Health check"
for _ in $(seq "$HEALTH_RETRIES"); do
  if curl -fsS --max-time 5 "$HEALTH_URL"; then
    echo
    echo "==> Done."
    exit 0
  fi
  sleep 1
done

echo "Health check failed: $HEALTH_URL did not answer in ${HEALTH_RETRIES} attempts." >&2
# The app is up as far as PM2 is concerned but not serving, so its own log is
# the only thing that explains why. Never let this mask the failure exit code.
pm2 logs golo --lines 40 --nostream || true
exit 1
