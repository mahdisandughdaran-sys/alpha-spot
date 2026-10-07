#!/bin/sh
# Idempotent local/sandbox starter. Works from any checkout, not only /workspace.
set -eu
ROOT="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
cd "$ROOT"
# :8081 is QA-only — a revive must never inherit a stale built-output preview.
# Called directly, not via npm: no node_modules needed, so nothing to wait for.
node scripts/preview.mjs stop || true
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>"$ROOT/.dev-server.log" 2>&1 &
echo "dev server starting on http://0.0.0.0:8080 (log: $ROOT/.dev-server.log)"
