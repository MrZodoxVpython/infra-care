#!/usr/bin/env bash
# check-secrets.sh — scan cepat secret yang tidak sengaja ter-commit.
# Hanya memeriksa file yang dilacak git. Tidak mencetak nilai lengkap.
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../../.." && pwd)"
cd "$REPO_ROOT" || exit 1

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "✖ Bukan repository git" >&2
  exit 1
fi

# File yang memang boleh memuat contoh/placeholder.
EXCLUDES=(
  ':!backend/.env.example'
  ':!README.md'
  ':!AGENTS.md'
  ':!docs/*'
  ':!.opencode/*'
  ':!package-lock.json'
  ':!backend/package-lock.json'
)

echo "INFRA-CARE SECRET SCAN"
echo "===================================================="
FOUND=0

# Connection string dengan kredensial (bukan localhost placeholder).
if git grep -nIE 'postgres(ql)?://[^:[:space:]]+:[^@[:space:]]+@' -- 'backend/*' 'frontend/*' '*.json' '*.jsonc' "${EXCLUDES[@]}" 2>/dev/null \
   | grep -vE 'localhost|127\.0\.0\.1|example|user:pass' | grep -q .; then
  echo "✖ Connection string dengan kredensial ditemukan:"
  git grep -nIE 'postgres(ql)?://[^:[:space:]]+:[^@[:space:]]+@' -- 'backend/*' 'frontend/*' '*.json' '*.jsonc' "${EXCLUDES[@]}" 2>/dev/null \
    | grep -vE 'localhost|127\.0\.0\.1|example|user:pass' | sed -E 's#://[^@]+@#://<REDACTED>@#g' | sed 's/^/  /'
  FOUND=$((FOUND + 1))
fi

# JWT secret yang bukan placeholder.
if git grep -nIE "JWT_SECRET[[:space:]]*[:=][[:space:]]*['\"]?[A-Za-z0-9_-]{12,}" -- 'backend/*' '*.json' '*.jsonc' '*.env*' "${EXCLUDES[@]}" 2>/dev/null \
   | grep -vE 'ganti|example|your|xxx|placeholder|<' | grep -q .; then
  echo "✖ Nilai JWT_SECRET seperti secret nyata ditemukan:"
  git grep -nIE "JWT_SECRET[[:space:]]*[:=][[:space:]]*['\"]?[A-Za-z0-9_-]{12,}" -- 'backend/*' '*.json' '*.jsonc' '*.env*' "${EXCLUDES[@]}" 2>/dev/null \
    | grep -vE 'ganti|example|your|xxx|placeholder|<' | sed -E 's/=.*/=<REDACTED>/' | sed 's/^/  /'
  FOUND=$((FOUND + 1))
fi

# Private key / token populer.
if git grep -nIE -- '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}' -- 'backend/*' 'frontend/*' '*.json' '*.jsonc' "${EXCLUDES[@]}" 2>/dev/null | grep -q .; then
  echo "✖ Kunci/token privat ditemukan:"
  git grep -nIE -- '-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----|ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}' -- 'backend/*' 'frontend/*' '*.json' '*.jsonc' "${EXCLUDES[@]}" 2>/dev/null \
    | sed -E 's/(ghp_|sk-|AKIA)[A-Za-z0-9]+/\1<REDACTED>/g' | sed 's/^/  /'
  FOUND=$((FOUND + 1))
fi

# File .env yang ikut dilacak.
TRACKED_ENV="$(git ls-files | grep -E '(^|/)\.env($|\.)' | grep -v '\.env\.example$' || true)"
if [ -n "$TRACKED_ENV" ]; then
  echo "✖ File .env ter-commit:"
  echo "$TRACKED_ENV" | sed 's/^/  /'
  FOUND=$((FOUND + 1))
fi

echo "===================================================="
if [ "$FOUND" -gt 0 ]; then
  echo "STATUS: GAGAL — $FOUND kategori secret ditemukan. Hapus dari riwayat git dan rotasi kredensial."
  exit 1
fi
echo "STATUS: LULUS — tidak ada secret terdeteksi pada file yang dilacak."
