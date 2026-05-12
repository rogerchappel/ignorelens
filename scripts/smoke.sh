#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

npm run build >/dev/null
node dist/src/cli.js scan fixtures/npm-safe --format markdown --out /tmp/ignorelens-safe.md
node dist/src/cli.js scan fixtures/npm-leaky --format json --out /tmp/ignorelens-leaky.json || true
node dist/src/cli.js explain fixtures/npm-safe/.gitignore >/tmp/ignorelens-explain.md

grep -q 'IgnoreLens Report' /tmp/ignorelens-safe.md
grep -q 'secret.env-file' /tmp/ignorelens-leaky.json
grep -q 'include exception' /tmp/ignorelens-explain.md
printf 'smoke ok: scanned safe/leaky fixtures and explained ignore file\n'
