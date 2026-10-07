#!/bin/sh
# Idempotent starter for preview + hibernate revive.
set -eu
ROOT="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
cd "$ROOT"
node scripts/preview.mjs stop || true
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>"$ROOT/.dev-server.log" 2>&1 &
echo "dev server starting on http://0.0.0.0:8080 (log: $ROOT/.dev-server.log)"
