#!/usr/bin/env bash
set -u

API_URL="${BUILDERPERKS_API_URL:-https://builderperks.netlify.app}"
PUBLISHER_ID="${BUILDERPERKS_PUBLISHER_ID:-${1:-}}"
SURFACE="${BUILDERPERKS_SURFACE:-terminal}"
CONTEXT="${BUILDERPERKS_CONTEXT:-${PWD##*/} coding workflow}"
KEYWORDS="${BUILDERPERKS_KEYWORDS:-}"
FORMAT="${BUILDERPERKS_FORMAT:-statusline}"

if [ -z "$PUBLISHER_ID" ]; then
  exit 0
fi

python3 - "$API_URL" "$PUBLISHER_ID" "$SURFACE" "$CONTEXT" "$KEYWORDS" "$FORMAT" <<'PY'
import json
import sys
import urllib.parse
import urllib.request

api_url, publisher_id, surface, context, keywords, output_format = sys.argv[1:]
params = {
    "publisherId": publisher_id,
    "surface": surface,
    "context": context,
    "format": output_format,
}
if keywords:
    params["keywords"] = keywords

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
