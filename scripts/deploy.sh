#!/usr/bin/env bash
#
# GoLo one-command redeploy. Run on the VPS from the project root:
#   npm run deploy          # pull, install, build, reload
#   npm run deploy -- --db  # also sync the database schema (only if it changed)
#
set -euo pipefail

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

echo "==> Health check"
curl -fsS http://localhost:3000/api/health && echo
echo "==> Done."
