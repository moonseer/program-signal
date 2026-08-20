#!/usr/bin/env bash
# Quarterly restore test: obtain a working tree, install, validate, build, spot-check assets.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUNDLE="${1:-}"
WORKDIR="${RESTORE_WORKDIR:-}"

cleanup() {
  if [[ -n "${WORKDIR:-}" && "${RESTORE_KEEP:-}" != "1" && -d "$WORKDIR" ]]; then
    rm -rf "$WORKDIR"
  fi
}
trap cleanup EXIT

if [[ -n "$BUNDLE" ]]; then
  if [[ ! -f "$BUNDLE" ]]; then
    echo "Bundle not found: $BUNDLE" >&2
    exit 1
  fi
  WORKDIR="$(mktemp -d "${TMPDIR:-/tmp}/ps-restore.XXXXXX")"
  echo "Cloning from bundle → $WORKDIR"
  git clone "$BUNDLE" "$WORKDIR"
  cd "$WORKDIR"
else
  echo "Using working tree → $ROOT"
  cd "$ROOT"
fi

echo "== npm ci =="
npm ci

echo "== validate:content =="
npm run validate:content

echo "== build =="
npm run build

echo "== asset spot-check =="
test -f content/articles/what-is-an-ai-agent-harness/diagrams/PS-D-0001.yml
test -f content/articles/what-is-an-ai-agent-harness/diagrams/PS-D-0001.svg
test -f content/articles/what-is-agentic-platform-engineering/diagrams/PS-D-0007.yml
test -d docs/editorial
test -f docs/standards/BACKUP.md || test -f "$ROOT/docs/standards/BACKUP.md"

echo "Restore test passed ($(date -u +%Y-%m-%dT%H:%M:%SZ))."
