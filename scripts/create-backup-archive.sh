#!/usr/bin/env bash
# Create a monthly-style third-copy archive (git bundle + corpus tarball + checksums).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

STAMP="${BACKUP_STAMP:-$(date -u +%Y-%m-%d)}"
OUT_DIR="${BACKUP_OUT_DIR:-$ROOT/backups}"
mkdir -p "$OUT_DIR"

BUNDLE="$OUT_DIR/program-signal-${STAMP}.gitbundle"
CORPUS="$OUT_DIR/program-signal-corpus-${STAMP}.tar.gz"
SUMS="$OUT_DIR/program-signal-backup-${STAMP}.sha256"

echo "Writing git bundle → $BUNDLE"
git bundle create "$BUNDLE" --all

CORPUS_PATHS=(content docs editorial agents package.json package-lock.json tsconfig.json vercel.json)
for cfg in next.config.ts next.config.mjs next.config.js; do
  if [[ -f "$cfg" ]]; then
    CORPUS_PATHS+=("$cfg")
  fi
done

echo "Writing corpus archive → $CORPUS"
tar -czf "$CORPUS" "${CORPUS_PATHS[@]}"

(
  cd "$OUT_DIR"
  shasum -a 256 "$(basename "$BUNDLE")" "$(basename "$CORPUS")" > "$(basename "$SUMS")"
)

echo "Checksums → $SUMS"
cat "$SUMS"
echo "Done. Copy these files off GitHub (object storage / offline media)."
