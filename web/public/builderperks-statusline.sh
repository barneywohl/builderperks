#!/usr/bin/env bash
set -u

API_URL="${BUILDERPERKS_API_URL:-https://builderperks.netlify.app}"
PUBLISHER_ID="${BUILDERPERKS_PUBLISHER_ID:-${1:-}}"
SURFACE="${BUILDERPERKS_SURFACE:-terminal}"
CONTEXT="${BUILDERPERKS_CONTEXT:-${PWD##*/} coding workflow}"
KEYWORDS="${BUILDERPERKS_KEYWORDS:-}"
BLOCKED_KEYWORDS="${BUILDERPERKS_BLOCKED_KEYWORDS:-}"
ALLOWED_CATEGORIES="${BUILDERPERKS_ALLOWED_CATEGORIES:-}"
BLOCKED_CATEGORIES="${BUILDERPERKS_BLOCKED_CATEGORIES:-}"
VALUE_MODE="${BUILDERPERKS_VALUE_MODE:-passive}"
FORMAT="${BUILDERPERKS_FORMAT:-statusline}"

if [ -z "$PUBLISHER_ID" ]; then
  exit 0
fi

python3 - "$API_URL" "$PUBLISHER_ID" "$SURFACE" "$CONTEXT" "$KEYWORDS" "$BLOCKED_KEYWORDS" "$ALLOWED_CATEGORIES" "$BLOCKED_CATEGORIES" "$VALUE_MODE" "$FORMAT" <<'PY'
import json
import sys
import urllib.parse
import urllib.request

api_url, publisher_id, surface, context, keywords, blocked_keywords, allowed_categories, blocked_categories, value_mode, output_format = sys.argv[1:]
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
    render = data.get("render") or {}
    line = render.get("statusLine") or render.get("terminalLine") or ""
    if line:
        print(line[:500])
except Exception:
    pass
PY
