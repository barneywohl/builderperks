#!/usr/bin/env bash
set -eu

API_URL="${BUILDERPERKS_API_URL:-https://builderperks.netlify.app}"
PUBLISHER_ID="${1:-}"
INSTALL_DIR="${BUILDERPERKS_INSTALL_DIR:-$HOME/.builderperks}"

if [ -z "$PUBLISHER_ID" ]; then
  cat >&2 <<'EOF'
Usage:
  curl -fsSL https://builderperks.netlify.app/install-statusline.sh | bash -s -- pub_x

Register first at:
  https://builderperks.netlify.app/#api
EOF
  exit 1
fi

mkdir -p "$INSTALL_DIR"
curl -fsSL "$API_URL/builderperks-statusline.sh" -o "$INSTALL_DIR/statusline.sh"
chmod +x "$INSTALL_DIR/statusline.sh"

cat <<EOF
BuilderPerks status-line helper installed:
  $INSTALL_DIR/statusline.sh

Test it:
  BUILDERPERKS_PUBLISHER_ID=$PUBLISHER_ID BUILDERPERKS_KEYWORDS=typescript,react,postgres BUILDERPERKS_BLOCKED_KEYWORDS=crypto,gambling $INSTALL_DIR/statusline.sh

Claude Code statusLine command:
  BUILDERPERKS_PUBLISHER_ID=$PUBLISHER_ID BUILDERPERKS_KEYWORDS=typescript,react,postgres BUILDERPERKS_BLOCKED_KEYWORDS=crypto,gambling $INSTALL_DIR/statusline.sh

This sends only broad preference keywords you choose. It does not send prompts or personal data.
EOF
