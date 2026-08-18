#!/usr/bin/env bash
#
# Cloud Agent start step for the GoLo marketing site.
#
# Per-boot reconciliation: brings the local Postgres cluster back up (its data
# directory, roles, and tables are preserved in the snapshot) and waits until it
# is ready. Idempotent — a no-op when the cluster is already running.
set -euo pipefail

PG_VER="$(ls /usr/lib/postgresql/ | sort -n | tail -1)"

echo "==> Starting Postgres ${PG_VER} cluster"
sudo pg_ctlcluster "$PG_VER" main start 2>/dev/null || true

echo "==> Waiting for Postgres to accept connections"
for _ in $(seq 1 30); do
  if sudo -u postgres pg_isready -q; then
    echo "==> Postgres is ready"
    exit 0
  fi
  sleep 1
done

echo "Postgres failed to become ready" >&2
exit 1
