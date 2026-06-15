#!/usr/bin/env bash
set -eu

API_URL="${BUILDERPERKS_API_URL:-https://builderperks.netlify.app}"
PUBLISHER_ID="${1:-}"
PUBLISHER_TOKEN="${2:-${BUILDERPERKS_PUBLISHER_TOKEN:-}}"
KEYWORDS="${3:-${BUILDERPERKS_KEYWORDS:-typescript,react,postgres}}"
SURFACE="${4:-${BUILDERPERKS_SURFACE:-terminal}}"
BLOCKED_KEYWORDS="${BUILDERPERKS_BLOCKED_KEYWORDS:-crypto,gambling}"
BLOCKED_CATEGORIES="${BUILDERPERKS_BLOCKED_CATEGORIES:-adult,gambling}"
VALUE_MODE="${BUILDERPERKS_VALUE_MODE:-relevant}"
INSTALL_DIR="${BUILDERPERKS_INSTALL_DIR:-$HOME/.builderperks}"
CONFIG_FILE="$INSTALL_DIR/config.env"

if [ -z "$PUBLISHER_ID" ]; then
  cat >&2 <<'EOF'
Usage:
  curl -fsSL https://builderperks.netlify.app/install-statusline.sh | bash -s -- pub_x bp_pub_token

Inspect first:
  curl -fsS https://builderperks.netlify.app/install-statusline.sh -o install-statusline.sh
  less install-statusline.sh
  bash install-statusline.sh pub_x bp_pub_token

Register first at:
  https://builderperks.netlify.app/#api
EOF
  exit 1
fi

mkdir -p "$INSTALL_DIR"
curl -fsSL "$API_URL/builderperks-statusline.sh" -o "$INSTALL_DIR/statusline.sh"
chmod +x "$INSTALL_DIR/statusline.sh"

shell_quote() {
  printf "'%s'" "$(printf "%s" "$1" | sed "s/'/'\\\\''/g")"
}

cat > "$CONFIG_FILE" <<EOF
BUILDERPERKS_API_URL=$(shell_quote "$API_URL")
BUILDERPERKS_PUBLISHER_ID=$(shell_quote "$PUBLISHER_ID")
BUILDERPERKS_PUBLISHER_TOKEN=$(shell_quote "$PUBLISHER_TOKEN")
BUILDERPERKS_SURFACE=$(shell_quote "$SURFACE")
BUILDERPERKS_KEYWORDS=$(shell_quote "$KEYWORDS")
BUILDERPERKS_BLOCKED_KEYWORDS=$(shell_quote "$BLOCKED_KEYWORDS")
BUILDERPERKS_BLOCKED_CATEGORIES=$(shell_quote "$BLOCKED_CATEGORIES")
BUILDERPERKS_VALUE_MODE=$(shell_quote "$VALUE_MODE")
EOF
chmod 600 "$CONFIG_FILE"

cat <<EOF
BuilderPerks status-line helper installed:
  $INSTALL_DIR/statusline.sh

Saved publisher config:
  $CONFIG_FILE

Test it:
  $INSTALL_DIR/statusline.sh

If the line is blank, verify setup without breaking quiet status-line behavior:
  BUILDERPERKS_DEBUG=1 $INSTALL_DIR/statusline.sh

Claude Code statusLine command:
  $INSTALL_DIR/statusline.sh

Claude Code settings snippet:
  "statusLine": { "type": "command", "command": "$INSTALL_DIR/statusline.sh" }

Optional controls:
  BUILDERPERKS_KEYWORDS=typescript,react,postgres   # broad keywords only
  BUILDERPERKS_VALUE_MODE=relevant                  # passive, relevant, high_value
  BUILDERPERKS_ALLOWED_CATEGORIES=finance           # explicit opt-in only
  BUILDERPERKS_BLOCKED_CATEGORIES=adult,gambling

This sends only broad preference keywords and category choices you choose. It does not send prompts or personal data.
Your publisher token is stored only in $CONFIG_FILE and is required for new publisher traffic.
The helper stays quiet by default; BUILDERPERKS_DEBUG=1 prints setup diagnostics to stderr.
EOF
