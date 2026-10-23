#!/bin/bash
# Live integration run of golowebsite#124 (this checkout) against the real
# Reach API, with a throwaway local PostgreSQL 16 database and ONLY owner-controlled test
# addresses (REACH_SYNC_ONLY). The token is read from the macOS Keychain into the environment
# of the child processes only: never an argument, never printed.
#
#   live124.sh setup                 start PG16 on 127.0.0.1:54329, create golo_reach_live, push the schema
#   live124.sh server                build + start the site on 127.0.0.1:3124 (sync on, test addresses only)
#   live124.sh signup <address>      POST /api/subscribe like the blog band does
#   live124.sh retry                 one run of scripts/reach-retry.mjs (the production cron script)
#   live124.sh rows                  show the local rows (address, status, attempts)
#   live124.sh delete <address>      scripts/newsletter-delete.mjs for one address (website row + Reach contact)
#   live124.sh stop                  stop the site and PG16
set -euo pipefail
WT="$(cd "$(dirname "$0")/../.." && pwd)"
PGBIN=/opt/homebrew/opt/postgresql@16/bin
PGDATA=/tmp/golo-pg-reach-live
DB=postgresql://postgres@127.0.0.1:54329/golo_reach_live
ONLY="${REACH_SYNC_ONLY:?set REACH_SYNC_ONLY to the comma-separated owner-controlled test addresses}"
export LC_ALL=en_US.UTF-8

with_token() {
  local t
  t="$(security find-generic-password -s golo-reach-collab-token -w 2>/dev/null)" || { echo "No Keychain token; nothing run."; exit 2; }
  REACH_API_TOKEN="$t" REACH_PROFILE_UUID="${REACH_PROFILE_UUID:?set REACH_PROFILE_UUID}" \
  REACH_SYNC_ENABLED=true REACH_SYNC_ONLY="$ONLY" DATABASE_URL="$DB" DIRECT_URL="$DB" "$@"
}

case "${1:-}" in
  setup)
    [ -f "$PGDATA/PG_VERSION" ] || "$PGBIN/initdb" -D "$PGDATA" -U postgres --auth=trust >/dev/null
    "$PGBIN/pg_isready" -h 127.0.0.1 -p 54329 -q || "$PGBIN/pg_ctl" -D "$PGDATA" -l "$PGDATA.log" -o "-p 54329 -c listen_addresses=127.0.0.1 -c unix_socket_directories=''" start >/dev/null
    sleep 2
    "$PGBIN/psql" -h 127.0.0.1 -p 54329 -U postgres -qc "drop database if exists golo_reach_live" -c "create database golo_reach_live"
    (cd "$WT" && DATABASE_URL="$DB" DIRECT_URL="$DB" npx prisma db push --skip-generate >/dev/null && echo "schema pushed")
    ;;
  server)
    (cd "$WT/.next/standalone" && cp -R ../static .next/ 2>/dev/null; with_token env PORT=3124 HOSTNAME=127.0.0.1 node server.js > /tmp/live124-server.log 2>&1 &)
    for i in $(seq 1 30); do curl -s -o /dev/null http://127.0.0.1:3124/ && { echo "server up"; exit 0; }; sleep 1; done; echo "server did not start"; exit 1
    ;;
  signup)
    curl -s -w ' HTTP %{http_code}\n' -X POST http://127.0.0.1:3124/api/subscribe \
      -H 'Content-Type: application/json' -H 'Origin: http://127.0.0.1:3124' \
      --data "{\"email\":\"$2\",\"source\":\"blog\",\"hp_note\":\"\"}"
    ;;
  retry)
    (cd "$WT" && with_token node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/reach-retry.mjs)
    ;;
  rows)
    "$PGBIN/psql" -h 127.0.0.1 -p 54329 -U postgres -d golo_reach_live -c 'select email, source, "reachSyncStatus", "reachSyncAttempts", "reachLastAttemptAt" from "NewsletterLead" order by "createdAt"'
    ;;
  delete)
    (cd "$WT" && printf '%s\n' "$2" | with_token node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/newsletter-delete.mjs --confirm)
    ;;
  stop)
    pkill -f "golowebsite-wt-121/.next/standalone/server.js" || pkill -f "standalone/server.js" || true
    "$PGBIN/pg_ctl" -D "$PGDATA" stop >/dev/null 2>&1 || true
    ;;
  *) sed -n 2,14p "$0" ;;
esac
