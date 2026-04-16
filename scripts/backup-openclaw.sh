#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="/data/.openclaw"
BACKUP_DIR="/data/.openclaw/backups"
STAMP="$(TZ=Europe/Madrid date +%F_%H-%M-%S)"
HOSTNAME_SAFE="$(hostname | tr -cd '[:alnum:]._-')"
ARCHIVE_NAME="openclaw-backup_${HOSTNAME_SAFE}_${STAMP}.tar.gz"
TMP_NAME=".${ARCHIVE_NAME}.tmp"
KEEP_DAYS="14"

mkdir -p "$BACKUP_DIR"

tar \
  --exclude="$BACKUP_DIR" \
  -czf "$BACKUP_DIR/$TMP_NAME" \
  "$SOURCE_DIR"

mv "$BACKUP_DIR/$TMP_NAME" "$BACKUP_DIR/$ARCHIVE_NAME"
find "$BACKUP_DIR" -maxdepth 1 -type f -name 'openclaw-backup_*.tar.gz' -mtime +"$KEEP_DAYS" -delete

echo "Backup created: $BACKUP_DIR/$ARCHIVE_NAME"
