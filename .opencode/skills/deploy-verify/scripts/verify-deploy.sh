#!/usr/bin/env bash
# verify-deploy.sh — bandingkan build lokal dengan produksi INFRA-CARE dan smoke test API.
#
# Pemakaian:
#   bash .opencode/skills/deploy-verify/scripts/verify-deploy.sh [--no-build] [--url=URL]
#
# Environment:
#   DEPLOY_URL     default https://infra-care-pi.vercel.app
#   DEMO_PASSWORD  default password123
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
URL="${DEPLOY_URL:-https://infra-care-pi.vercel.app}"
DO_BUILD=1
PASSWORD="${DEMO_PASSWORD:-password123}"

for arg in "$@"; do
  case "$arg" in
    --no-build) DO_BUILD=0 ;;
    --url=*) URL="${arg#--url=}" ;;
    --help|-h)
      sed -n '2,12p' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *)
      echo "Argumen tidak dikenal: $arg" >&2
      exit 2
      ;;
  esac
done

URL="${URL%/}"
TMP="$(mktemp -d "${TMPDIR:-/tmp}/infra-deploy.XXXXXX")"
trap 'rm -rf "$TMP"' EXIT

FAIL=0
PASS=0
SKIP=0
ok()   { PASS=$((PASS + 1)); printf '  \033[32m✔\033[0m %s\n' "$1"; }
bad()  { FAIL=$((FAIL + 1)); printf '  \033[31m✖\033[0m %s\n' "$1"; }
skip() { SKIP=$((SKIP + 1)); printf '  \033[33m∼\033[0m %s\n' "$1"; }
info() { printf '  • %s\n' "$1"; }

echo "INFRA-CARE DEPLOY VERIFY"
echo "===================================================="
echo "Repo   : $REPO_ROOT"
echo "Target : $URL"
echo "Commit : $(git -C "$REPO_ROOT" rev-parse --short HEAD 2>/dev/null || echo '-')"
echo ""

# ---------- 1. Build ----------
DIST="$REPO_ROOT/frontend/dist"
if [ "$DO_BUILD" -eq 1 ]; then
  echo "[1/5] Build lokal"
  if [ ! -d "$REPO_ROOT/frontend/node_modules" ]; then
    bad "frontend/node_modules tidak ada. Jalankan: npm --prefix frontend install"
    exit 1
  fi
  if (cd "$REPO_ROOT/frontend" && npx vite build --outDir "$TMP/dist" --emptyOutDir >"$TMP/build.log" 2>&1); then
    DIST="$TMP/dist"
    ok "vite build sukses"
  else
    bad "vite build gagal"
    tail -30 "$TMP/build.log" | sed 's/^/    /'
    exit 1
  fi
else
  echo "[1/5] Build lokal (dilewati)"
  if [ ! -f "$DIST/index.html" ]; then
    bad "frontend/dist/index.html tidak ada. Jalankan tanpa --no-build."
    exit 1
  fi
  ok "memakai frontend/dist yang ada"
fi

# ---------- 2. Ambil HTML produksi ----------
echo ""
echo "[2/5] HTML produksi"
CODE="$(curl -sS -L -o "$TMP/prod.html" -w '%{http_code}' "$URL/" 2>"$TMP/curl.err" || true)"
if [ "$CODE" = "200" ]; then
  ok "GET / → 200"
else
  bad "GET / → $CODE"
  sed 's/^/    /' "$TMP/curl.err" 2>/dev/null || true
fi

# ---------- 3. Bandingkan asset ----------
echo ""
echo "[3/5] Asset hash"
asset_names() {
  grep -oE '(src|href)="[^"]*assets/[^"]+"' "$1" 2>/dev/null \
    | sed -E 's/.*assets\///; s/"$//' \
    | sort -u
}
asset_names "$DIST/index.html" >"$TMP/local.assets"
asset_names "$TMP/prod.html" >"$TMP/prod.assets"

LOCAL_JS="$(grep -E '^index-.*\.js$' "$TMP/local.assets" | head -1)"
LOCAL_CSS="$(grep -E '^index-.*\.css$' "$TMP/local.assets" | head -1)"
PROD_JS="$(grep -E '^index-.*\.js$' "$TMP/prod.assets" | head -1)"
PROD_CSS="$(grep -E '^index-.*\.css$' "$TMP/prod.assets" | head -1)"

info "lokal  JS: ${LOCAL_JS:-'-'}  CSS: ${LOCAL_CSS:-'-'}"
info "produksi JS: ${PROD_JS:-'-'}  CSS: ${PROD_CSS:-'-'}"

if [ -n "$LOCAL_JS" ] && [ "$LOCAL_JS" = "$PROD_JS" ]; then
  ok "asset JS cocok"
else
  bad "asset JS berbeda — produksi mungkin belum memakai commit terbaru"
fi
if [ -n "$LOCAL_CSS" ] && [ "$LOCAL_CSS" = "$PROD_CSS" ]; then
  ok "asset CSS cocok"
else
  bad "asset CSS berbeda — produksi mungkin belum memakai commit terbaru"
fi

if [ -n "$PROD_JS" ] && [ -n "$PROD_CSS" ]; then
  for asset in "$PROD_JS" "$PROD_CSS"; do
    ACODE="$(curl -sS -o /dev/null -w '%{http_code}' "$URL/assets/$asset" || true)"
    if [ "$ACODE" = "200" ]; then ok "assets/$asset → 200"; else bad "assets/$asset → $ACODE"; fi
  done
fi

# ---------- 4. API publik ----------
echo ""
echo "[4/5] API publik"
API_CODE="$(curl -sS -o "$TMP/stats.json" -w '%{http_code}' "$URL/api/public/stats" || true)"
if [ "$API_CODE" = "200" ] && grep -q '"total"' "$TMP/stats.json"; then
  ok "GET /api/public/stats → 200 (JSON valid)"
else
  bad "GET /api/public/stats → $API_CODE / JSON tidak valid"
  head -c 200 "$TMP/stats.json" 2>/dev/null | sed 's/^/    /'
  echo
fi

# ---------- 5. Auth & RBAC ----------
echo ""
echo "[5/5] Auth & RBAC"
login() {
  local email="$1" out="$2"
  curl -sS -o "$out" -w '%{http_code}' -X POST "$URL/api/auth/login" \
    -H 'Content-Type: application/json' \
    -d "{\"email\":\"$email\",\"password\":\"$PASSWORD\"}" || true
}
token_from() {
  node -e 'const fs=require("fs");try{const j=JSON.parse(fs.readFileSync(process.argv[1],"utf8"));process.stdout.write(j.token||"")}catch{}' "$1"
}
status_with() {
  local method="$1" path="$2" token="$3"
  curl -sS -o /dev/null -w '%{http_code}' -X "$method" "$URL$path" \
    -H "Authorization: Bearer $token" || true
}

ADMIN_CODE="$(login budi@infracare.id "$TMP/admin.json")"
ADMIN_TOKEN="$(token_from "$TMP/admin.json")"
if [ "$ADMIN_CODE" = "200" ] && [ -n "$ADMIN_TOKEN" ]; then
  ok "login admin → 200"
elif [ "$ADMIN_CODE" = "400" ]; then
  skip "login admin → 400: kredensial demo tidak berlaku. Set DEMO_PASSWORD untuk menguji auth/RBAC."
else
  bad "login admin → $ADMIN_CODE"
fi

if [ -n "$ADMIN_TOKEN" ]; then
  for path in /api/auth/me /api/users /api/reports /api/settings; do
    C="$(status_with GET "$path" "$ADMIN_TOKEN")"
    if [ "$C" = "200" ]; then ok "admin GET $path → 200"; else bad "admin GET $path → $C"; fi
  done

  # Ringkas data agar terbukti bukan respons kosong.
  USERS_CODE="$(curl -sS -o "$TMP/users.json" -w '%{http_code}' "$URL/api/users" -H "Authorization: Bearer $ADMIN_TOKEN" || true)"
  if [ "$USERS_CODE" = "200" ] && grep -q '"role"' "$TMP/users.json"; then
    ok "GET /api/users mengembalikan data pengguna"
  else
    bad "GET /api/users tidak mengembalikan data yang diharapkan"
  fi
fi

PETUGAS_CODE="$(login andi@infracare.id "$TMP/petugas.json")"
PETUGAS_TOKEN="$(token_from "$TMP/petugas.json")"
if [ "$PETUGAS_CODE" = "200" ] && [ -n "$PETUGAS_TOKEN" ]; then
  ok "login petugas → 200"
  FORBID="$(status_with GET /api/users "$PETUGAS_TOKEN")"
  if [ "$FORBID" = "403" ]; then
    ok "petugas GET /api/users → 403 (RBAC benar)"
  else
    bad "petugas GET /api/users → $FORBID (seharusnya 403) — potensi kebocoran RBAC"
  fi
elif [ "$PETUGAS_CODE" = "400" ]; then
  skip "login petugas → 400: kredensial demo tidak berlaku. Set DEMO_PASSWORD untuk menguji RBAC."
else
  bad "login petugas → $PETUGAS_CODE"
fi

# ---------- Ringkasan ----------
echo ""
echo "===================================================="
echo "Lulus: $PASS   Gagal: $FAIL   Dilewati: $SKIP"
if [ "$FAIL" -gt 0 ]; then
  echo "STATUS: GAGAL — jangan klaim deploy sehat."
  exit 1
fi
if [ "$SKIP" -gt 0 ]; then
  echo "STATUS: LULUS SEBAGIAN — asset & API publik sehat; auth/RBAC belum terverifikasi."
  exit 0
fi
echo "STATUS: LULUS — produksi memakai asset build ini dan API sehat."
