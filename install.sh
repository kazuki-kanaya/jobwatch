#!/usr/bin/env sh
set -eu

REPO="kazuki-kanaya/obsern"
BIN="obsern"
VERSION="__OBSERN_RELEASE_VERSION__"

INSTALL="/usr/local/bin"
FALLBACK="$HOME/.local/bin"

os() { case "$(uname -s)" in Linux) echo Linux;; Darwin) echo Darwin;; *) echo "unsupported OS" >&2; exit 1;; esac; }
arch() { case "$(uname -m)" in x86_64|amd64) echo x86_64;; arm64|aarch64) echo arm64;; *) echo "unsupported arch" >&2; exit 1;; esac; }

need() { command -v "$1" >/dev/null 2>&1 || { echo "missing: $1" >&2; exit 1; }; }
need curl; need tar; need awk; need uname; need mktemp

OS="$(os)"; ARCH="$(arch)"
TGZ="${BIN}_${OS}_${ARCH}.tar.gz"
BASE="https://github.com/${REPO}/releases/download/${VERSION}"

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT INT TERM

curl -fL "$BASE/$TGZ" -o "$TMP/$TGZ"
curl -fL "$BASE/checksums.txt" -o "$TMP/checksums.txt"

EXPECTED="$(awk -v n="$TGZ" '$2==n{print $1; exit}' "$TMP/checksums.txt")"
[ -n "$EXPECTED" ] || { echo "checksum not found: $TGZ" >&2; exit 1; }

if command -v sha256sum >/dev/null 2>&1; then
  ACTUAL="$(sha256sum "$TMP/$TGZ" | awk '{print $1}')"
else
  ACTUAL="$(shasum -a 256 "$TMP/$TGZ" | awk '{print $1}')"
fi
[ "$EXPECTED" = "$ACTUAL" ] || { echo "checksum mismatch" >&2; exit 1; }

tar -xzf "$TMP/$TGZ" -C "$TMP"
[ -f "$TMP/$BIN" ] || { echo "binary not found in archive" >&2; exit 1; }

DEST="$INSTALL"; SUDO=""
if [ -d "$DEST" ] && [ ! -w "$DEST" ]; then
  if command -v sudo >/dev/null 2>&1; then SUDO="sudo"; else DEST="$FALLBACK"; fi
fi

if [ -n "$SUDO" ]; then
  $SUDO mkdir -p "$DEST"
  $SUDO cp "$TMP/$BIN" "$DEST/$BIN"
  $SUDO chmod 0755 "$DEST/$BIN"
else
  mkdir -p "$DEST"
  cp "$TMP/$BIN" "$DEST/$BIN"
  chmod 0755 "$DEST/$BIN"
fi

echo "Installed $BIN $VERSION to $DEST/$BIN"
[ "$DEST" = "$FALLBACK" ] && echo "Add to PATH: export PATH=\"$DEST:\$PATH\""