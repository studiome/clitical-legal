#!/usr/bin/env bash
set -euo pipefail

base_url="${1:-https://studiome.github.io/clitical-legal}"
paths=(
  "/privacy/ja/|CLiTICAL プライバシーポリシー"
  "/privacy/en/|CLiTICAL Privacy Policy"
  "/terms/ja/|CLiTICAL 利用規約"
  "/terms/en/|CLiTICAL Terms of Use"
  "/support/ja/|CLiTICAL サポート"
  "/support/en/|CLiTICAL Support"
)

for user_agent in "Mozilla/5.0 CLiTICALAvailabilityMonitor/1.0" "Googlebot"; do
  for item in "${paths[@]}"; do
    path="${item%%|*}"
    expected="${item#*|}"
    headers="$(mktemp)"
    body="$(mktemp)"
    status="$(curl --silent --show-error --location --max-redirs 3 --max-time 30 \
      --user-agent "$user_agent" --dump-header "$headers" --output "$body" \
      --write-out '%{http_code}' "${base_url}${path}")"
    test "$status" = "200"
    grep -Eiq '^content-type: *text/html' "$headers"
    grep -Fq "$expected" "$body"
    if grep -Eiq "sign in to github|type=['\"]password['\"]" "$body"; then
      echo "Authentication page detected at ${base_url}${path}" >&2
      exit 1
    fi
    rm -f "$headers" "$body"
  done
done

echo "All public legal pages are accessible without authentication."
