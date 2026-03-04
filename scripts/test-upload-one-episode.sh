#!/bin/bash
set -e

# Test upload - uploads just ONE episode to verify setup

BUCKET="wakaru-media"
TEST_FILE="/mnt/ClusterFS/MEDIA/Anime/Death Note/Death Note - 01x01 - Rebirth.mkv"
DEST="s3://$BUCKET/videos/death-note/Death_Note_-_01x01_-_Rebirth.mkv"
CDN_URL="https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/videos/death-note/Death_Note_-_01x01_-_Rebirth.mkv"

echo "========================================"
echo "   TEST UPLOAD - Single Episode"
echo "========================================"
echo ""
echo "File: $(basename "$TEST_FILE")"
echo "Size: $(du -h "$TEST_FILE" | cut -f1)"
echo "Destination: $DEST"
echo ""
echo "Starting upload..."
echo ""

# Upload with progress
s3cmd put --acl-public \
    --mime-type="video/mkv" \
    --progress \
    "$TEST_FILE" \
    "$DEST"

echo ""
echo "========================================"
echo "   ✓ Upload Successful!"
echo "========================================"
echo ""
echo "CDN URL (use this in Wakaru):"
echo "$CDN_URL"
echo ""
echo "Test playback:"
echo "curl -I \"$CDN_URL\""
echo ""
echo "If this works, run the full upload script:"
echo "./upload-anime-to-spaces.sh"
echo ""
