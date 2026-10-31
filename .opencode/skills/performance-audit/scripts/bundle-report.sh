#!/usr/bin/env bash
# bundle-report.sh — laporan ukuran bundle INFRA-CARE.
#
# Pemakaian:
#   bash .opencode/skills/performance-audit/scripts/bundle-report.sh [--no-build] [--strict]
#
# Environment:
#   MAX_JS_KB=300 MAX_CSS_KB=100 MAX_TOTAL_KB=1500 MAX_IMAGE_KB=200
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
DO_BUILD=1
STRICT=0
for arg in "$@"; do
  case "$arg" in
    --no-build) DO_BUILD=0 ;;
    --strict) STRICT=1 ;;
    --help|-h) sed -n '2,10p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Argumen tidak dikenal: $arg" >&2; exit 2 ;;
  esac
done

MAX_JS_KB="${MAX_JS_KB:-300}"
MAX_CSS_KB="${MAX_CSS_KB:-100}"
MAX_TOTAL_KB="${MAX_TOTAL_KB:-1500}"
MAX_IMAGE_KB="${MAX_IMAGE_KB:-200}"

TMP="$(mktemp -d "${TMPDIR:-/tmp}/infra-bundle.XXXXXX")"
trap 'rm -rf "$TMP"' EXIT
DIST="$REPO_ROOT/frontend/dist"

echo "INFRA-CARE BUNDLE REPORT"
echo "===================================================="

if [ "$DO_BUILD" -eq 1 ]; then
  if [ ! -d "$REPO_ROOT/frontend/node_modules" ]; then
    echo "✖ frontend/node_modules tidak ada. Jalankan: npm --prefix frontend install" >&2
    exit 1
  fi
  echo "Build   : vite build"
  if (cd "$REPO_ROOT/frontend" && npx vite build --outDir "$TMP/dist" --emptyOutDir >"$TMP/build.log" 2>&1); then
    DIST="$TMP/dist"
    echo "Status  : build sukses"
    if grep -qi 'warning\|chunk.*larger' "$TMP/build.log"; then
      echo "Catatan :"
      grep -i 'warning\|chunk.*larger' "$TMP/build.log" | head -10 | sed 's/^/  /'
    fi
  else
    echo "✖ build gagal" >&2
    tail -30 "$TMP/build.log" | sed 's/^/  /' >&2
    exit 1
  fi
else
  echo "Build   : dilewati (memakai frontend/dist)"
  if [ ! -f "$DIST/index.html" ]; then
    echo "✖ frontend/dist/index.html tidak ada" >&2
    exit 1
  fi
fi

if [ ! -d "$DIST" ]; then
  echo "✖ Folder dist tidak ditemukan: $DIST" >&2
  exit 1
fi

bytes() { wc -c <"$1" | tr -d ' '; }
kb() { awk -v b="$1" 'BEGIN{printf "%.1f", b/1024}'; }
gzip_bytes() { gzip -9 -c "$1" 2>/dev/null | wc -c | tr -d ' '; }

# Kumpulkan: size \t gzip \t path
: >"$TMP/files.tsv"
TOTAL=0
COUNT=0
JS_RAW=0
CSS_RAW=0
MAPS=0
BIG_IMAGES=0
while IFS= read -r -d '' f; do
  size="$(bytes "$f")"
  rel="${f#"$DIST"/}"
  gz="$(gzip_bytes "$f")"
  printf '%s\t%s\t%s\n' "$size" "$gz" "$rel" >>"$TMP/files.tsv"
  TOTAL=$((TOTAL + size))
  COUNT=$((COUNT + 1))
  case "$rel" in
    *.js) JS_RAW=$((JS_RAW + size)) ;;
    *.css) CSS_RAW=$((CSS_RAW + size)) ;;
    *.map) MAPS=$((MAPS + 1)) ;;
    *.png|*.jpg|*.jpeg|*.webp|*.gif|*.svg)
      if [ "$size" -gt $((MAX_IMAGE_KB * 1024)) ]; then BIG_IMAGES=$((BIG_IMAGES + 1)); fi
      ;;
  esac
done < <(find "$DIST" -type f -print0)

echo "Total   : $(kb "$TOTAL") KB ($COUNT file)"
echo "JS      : $(kb "$JS_RAW") KB mentah"
echo "CSS     : $(kb "$CSS_RAW") KB mentah"
echo ""

echo "15 aset terbesar"
echo "----------------------------------------------------"
printf '%-44s %10s %10s\n' "FILE" "MENTAH" "GZIP"
sort -rn -k1,1 "$TMP/files.tsv" | head -15 | while IFS=$'\t' read -r size gz rel; do
  printf '%-44s %9sK %9sK\n' "$rel" "$(kb "$size")" "$(kb "$gz")"
done
echo ""

# Budget per file JS/CSS terbesar, bukan total, agar chunk splitting tidak dihukum.
LARGEST_JS=0
LARGEST_CSS=0
while IFS=$'\t' read -r size gz rel; do
  case "$rel" in
    *.js) [ "$size" -gt "$LARGEST_JS" ] && LARGEST_JS="$size" ;;
    *.css) [ "$size" -gt "$LARGEST_CSS" ] && LARGEST_CSS="$size" ;;
  esac
done <"$TMP/files.tsv"

VIOL=0
check_budget() {
  local label="$1" actual_bytes="$2" max_kb="$3"
  local actual_kb max_bytes
  actual_kb="$(kb "$actual_bytes")"
  max_bytes=$((max_kb * 1024))
  if awk -v a="$actual_bytes" -v m="$max_bytes" 'BEGIN{exit !(a > m)}'; then
    echo "✖ $label: ${actual_kb} KB > budget ${max_kb} KB"
    VIOL=$((VIOL + 1))
  else
    echo "✔ $label: ${actual_kb} KB (budget ${max_kb} KB)"
  fi
}

echo "Budget"
echo "----------------------------------------------------"
check_budget "JS terbesar" "$LARGEST_JS" "$MAX_JS_KB"
check_budget "CSS terbesar" "$LARGEST_CSS" "$MAX_CSS_KB"
check_budget "Total dist" "$TOTAL" "$MAX_TOTAL_KB"
echo ""

if [ "$MAPS" -gt 0 ]; then
  echo "⚠ $MAPS source map ditemukan di dist — pastikan tidak ikut ter-deploy."
else
  echo "✔ Tidak ada source map di dist."
fi
if [ "$BIG_IMAGES" -gt 0 ]; then
  echo "⚠ $BIG_IMAGES gambar > ${MAX_IMAGE_KB} KB — kompres/resize."
else
  echo "✔ Tidak ada gambar di atas ${MAX_IMAGE_KB} KB."
fi

echo ""
echo "===================================================="
if [ "$VIOL" -gt 0 ]; then
  if [ "$STRICT" -eq 1 ]; then
    echo "STATUS: GAGAL — $VIOL budget terlampaui."
    exit 1
  fi
  echo "STATUS: PERHATIAN — $VIOL budget terlampaui (jalankan --strict untuk menggagalkan CI)."
  exit 0
fi
echo "STATUS: LULUS — semua budget terpenuhi."
