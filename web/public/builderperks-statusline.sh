#!/usr/bin/env bash
set -u

CONFIG_FILE="${BUILDERPERKS_CONFIG_FILE:-$HOME/.builderperks/config.env}"
ENV_API_URL="${BUILDERPERKS_API_URL:-}"
ENV_PUBLISHER_ID="${BUILDERPERKS_PUBLISHER_ID:-}"
ENV_SURFACE="${BUILDERPERKS_SURFACE:-}"
ENV_CONTEXT="${BUILDERPERKS_CONTEXT:-}"
ENV_KEYWORDS="${BUILDERPERKS_KEYWORDS:-}"
ENV_BLOCKED_KEYWORDS="${BUILDERPERKS_BLOCKED_KEYWORDS:-}"
ENV_ALLOWED_CATEGORIES="${BUILDERPERKS_ALLOWED_CATEGORIES:-}"
ENV_BLOCKED_CATEGORIES="${BUILDERPERKS_BLOCKED_CATEGORIES:-}"
ENV_VALUE_MODE="${BUILDERPERKS_VALUE_MODE:-}"
ENV_FORMAT="${BUILDERPERKS_FORMAT:-}"

if [ -f "$CONFIG_FILE" ]; then
  # shellcheck disable=SC1090
  . "$CONFIG_FILE"
  CONFIG_API_URL="${BUILDERPERKS_API_URL:-}"
  CONFIG_PUBLISHER_ID="${BUILDERPERKS_PUBLISHER_ID:-}"
  CONFIG_SURFACE="${BUILDERPERKS_SURFACE:-}"
  CONFIG_CONTEXT="${BUILDERPERKS_CONTEXT:-}"
  CONFIG_KEYWORDS="${BUILDERPERKS_KEYWORDS:-}"
  CONFIG_BLOCKED_KEYWORDS="${BUILDERPERKS_BLOCKED_KEYWORDS:-}"
  CONFIG_ALLOWED_CATEGORIES="${BUILDERPERKS_ALLOWED_CATEGORIES:-}"
  CONFIG_BLOCKED_CATEGORIES="${BUILDERPERKS_BLOCKED_CATEGORIES:-}"
  CONFIG_VALUE_MODE="${BUILDERPERKS_VALUE_MODE:-}"
  CONFIG_FORMAT="${BUILDERPERKS_FORMAT:-}"
fi

debug() {
  if [ "${BUILDERPERKS_DEBUG:-}" = "1" ]; then
    printf 'builderperks: %s\n' "$*" >&2
  fi
}

API_URL="${ENV_API_URL:-${CONFIG_API_URL:-https://builderperks.netlify.app}}"
PUBLISHER_ID="${ENV_PUBLISHER_ID:-${1:-${CONFIG_PUBLISHER_ID:-}}}"
SURFACE="${ENV_SURFACE:-${CONFIG_SURFACE:-terminal}}"
CONTEXT="${ENV_CONTEXT:-${CONFIG_CONTEXT:-${PWD##*/} coding workflow}}"
KEYWORDS="${ENV_KEYWORDS:-${CONFIG_KEYWORDS:-}}"
BLOCKED_KEYWORDS="${ENV_BLOCKED_KEYWORDS:-${CONFIG_BLOCKED_KEYWORDS:-}}"
ALLOWED_CATEGORIES="${ENV_ALLOWED_CATEGORIES:-${CONFIG_ALLOWED_CATEGORIES:-}}"
BLOCKED_CATEGORIES="${ENV_BLOCKED_CATEGORIES:-${CONFIG_BLOCKED_CATEGORIES:-}}"
VALUE_MODE="${ENV_VALUE_MODE:-${CONFIG_VALUE_MODE:-passive}}"
FORMAT="${ENV_FORMAT:-${CONFIG_FORMAT:-statusline}}"

if [ -z "$PUBLISHER_ID" ]; then
  debug "missing publisher id; run the installer from builderperks.netlify.app/#api"
  exit 0
fi

debug "using publisher=$PUBLISHER_ID surface=$SURFACE api=$API_URL config=$CONFIG_FILE"

python3 - "$API_URL" "$PUBLISHER_ID" "$SURFACE" "$CONTEXT" "$KEYWORDS" "$BLOCKED_KEYWORDS" "$ALLOWED_CATEGORIES" "$BLOCKED_CATEGORIES" "$VALUE_MODE" "$FORMAT" "${BUILDERPERKS_DEBUG:-0}" <<'PY'
import json
import sys
import urllib.parse
import urllib.request

api_url, publisher_id, surface, context, keywords, blocked_keywords, allowed_categories, blocked_categories, value_mode, output_format, debug = sys.argv[1:]
params = {
    "publisherId": publisher_id,
    "surface": surface,
    "context": context,
    "valueMode": value_mode,
    "format": output_format,
}
if keywords:
    params["keywords"] = keywords
if blocked_keywords:
    params["blockedKeywords"] = blocked_keywords
if allowed_categories:
    params["allowedCategories"] = allowed_categories
if blocked_categories:
    params["blockedCategories"] = blocked_categories

url = api_url.rstrip("/") + "/api/ad-stream?" + urllib.parse.urlencode(params)

try:
    with urllib.request.urlopen(url, timeout=2) as response:
        data = json.load(response)
    if debug == "1":
        print(f"builderperks: response ok={data.get('ok')} reason={data.get('reason', '')}", file=sys.stderr)
    render = data.get("render") or {}
    line = render.get("statusLine") or render.get("terminalLine") or ""
    if line:
        print(line[:500])
    elif debug == "1":
        print("builderperks: no status line returned", file=sys.stderr)
except Exception as exc:
    if debug == "1":
        print(f"builderperks: request failed: {exc}", file=sys.stderr)
    pass
PY
