#!/usr/bin/env sh
set -eu

REPO="kazuki-kanaya/obsern"
BINARY="obsern"
VERSION="${OBSERN_VERSION:-}"
INSTALL_DIR="${OBSERN_INSTALL_DIR:-/usr/local/bin}"

if [ $# -gt 0 ]; then
  VERSION="$1"
fi

need_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Error: required command not found: $1" >&2
    exit 1
  fi
}

need_cmd curl
need_cmd tar
need_cmd awk

if [ -z "$VERSION" ]; then
  VERSION="$(
    curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" \
      | sed -n 's/.*"tag_name"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' \
      | head -n 1
  )"
fi

if [ -z "$VERSION" ]; then
  echo "Error: failed to detect release version. Set OBSERN_VERSION or pass a version arg." >&2
  exit 1
fi

OS_RAW="$(uname -s)"
ARCH_RAW="$(uname -m)"

case "$OS_RAW" in
  Linux) OS_TITLE="Linux" ;;
  Darwin) OS_TITLE="Darwin" ;;
  *)
    echo "Error: unsupported OS: $OS_RAW" >&2
    exit 1
    ;;
esac

case "$ARCH_RAW" in
  x86_64|amd64) ARCH="x86_64" ;;
  arm64|aarch64) ARCH="arm64" ;;
  *)
    echo "Error: unsupported architecture: $ARCH_RAW" >&2
    exit 1
    ;;
esac

ARCHIVE="${BINARY}_${OS_TITLE}_${ARCH}.tar.gz"
DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${VERSION}/${ARCHIVE}"
CHECKSUM_URL="https://github.com/${REPO}/releases/download/${VERSION}/checksums.txt"

TMP_DIR="$(mktemp -d)"
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT INT TERM

echo "Downloading ${DOWNLOAD_URL}"
curl -fL "$DOWNLOAD_URL" -o "$TMP_DIR/$ARCHIVE"
echo "Downloading ${CHECKSUM_URL}"
curl -fL "$CHECKSUM_URL" -o "$TMP_DIR/checksums.txt"

EXPECTED_SUM="$(awk -v name="$ARCHIVE" '$2 == name { print $1; exit }' "$TMP_DIR/checksums.txt")"
if [ -z "$EXPECTED_SUM" ]; then
  echo "Error: checksum entry not found for ${ARCHIVE}" >&2
  exit 1
fi

if command -v sha256sum >/dev/null 2>&1; then
  ACTUAL_SUM="$(sha256sum "$TMP_DIR/$ARCHIVE" | awk '{print $1}')"
elif command -v shasum >/dev/null 2>&1; then
  ACTUAL_SUM="$(shasum -a 256 "$TMP_DIR/$ARCHIVE" | awk '{print $1}')"
else
  echo "Error: sha256sum or shasum is required for checksum verification." >&2
  exit 1
fi

if [ "$EXPECTED_SUM" != "$ACTUAL_SUM" ]; then
  echo "Error: checksum verification failed for ${ARCHIVE}" >&2
  exit 1
fi
echo "Checksum verified for ${ARCHIVE}"

tar -xzf "$TMP_DIR/$ARCHIVE" -C "$TMP_DIR"

if [ ! -f "$TMP_DIR/$BINARY" ]; then
  echo "Error: binary '${BINARY}' was not found in archive: ${ARCHIVE}" >&2
  exit 1
fi

SUDO=""
if [ -d "$INSTALL_DIR" ] && [ ! -w "$INSTALL_DIR" ]; then
  if command -v sudo >/dev/null 2>&1; then
    SUDO="sudo"
  else
    INSTALL_DIR="${HOME}/.local/bin"
    echo "Info: no permission for /usr/local/bin and sudo is unavailable." >&2
    echo "Info: installing to ${INSTALL_DIR} instead." >&2
  fi
fi

if [ ! -d "$INSTALL_DIR" ]; then
  if [ -n "$SUDO" ]; then
    $SUDO mkdir -p "$INSTALL_DIR"
  else
    mkdir -p "$INSTALL_DIR"
  fi
fi

if [ -n "$SUDO" ]; then
  $SUDO cp "$TMP_DIR/$BINARY" "$INSTALL_DIR/$BINARY"
  $SUDO chmod 0755 "$INSTALL_DIR/$BINARY"
else
  cp "$TMP_DIR/$BINARY" "$INSTALL_DIR/$BINARY"
  chmod 0755 "$INSTALL_DIR/$BINARY"
fi

echo "Installed ${BINARY} ${VERSION} to ${INSTALL_DIR}/${BINARY}"
if [ "$INSTALL_DIR" = "${HOME}/.local/bin" ]; then
  echo "Add to PATH if needed: export PATH=\"${HOME}/.local/bin:\$PATH\""
fi
