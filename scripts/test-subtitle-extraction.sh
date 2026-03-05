#!/bin/bash
# Test subtitle extraction on a single file

set -euo pipefail

# Source helper functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/subtitle-extraction-helpers.sh"

ANIME_BASE="/mnt/ClusterFS/MEDIA/Anime"
TEST_SHOW="Death Note"
OUTPUT_DIR="$HOME/.openclaw/workspace/Wakaru/test-subtitles"

echo "========================================"
echo "   Wakaru Subtitle Extraction Test"
echo "========================================"
echo ""

# Find first MKV file from Death Note
log_info "Looking for test file in: $ANIME_BASE/$TEST_SHOW"
TEST_FILE=$(find "$ANIME_BASE/$TEST_SHOW" -name "*.mkv" -type f 2>/dev/null | head -1)

if [ -z "$TEST_FILE" ]; then
    log_error "No MKV files found in $ANIME_BASE/$TEST_SHOW"
    exit 1
fi

log_success "Found test file: $(basename "$TEST_FILE")"
echo ""

# Analyze subtitle tracks
log_info "Analyzing subtitle tracks..."
TRACKS=$(get_subtitle_tracks "$TEST_FILE")

if [ -z "$TRACKS" ]; then
    log_error "No subtitle tracks found!"
    exit 1
fi

echo ""
log_info "Available subtitle tracks:"
echo "$TRACKS" | while IFS=',' read -r index codec lang title; do
    echo "  Track $index: $codec ($lang) - $title"
done
echo ""

# Find full subtitle track
FULL_TRACK=$(find_full_subtitle_track "$TEST_FILE")
log_info "Selected track for extraction: $FULL_TRACK"
echo ""

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Extract to both formats for comparison
BASENAME=$(basename "$TEST_FILE" .mkv)
SRT_FILE="$OUTPUT_DIR/${BASENAME}-en.srt"
ASS_FILE="$OUTPUT_DIR/${BASENAME}-en.ass"

# Extract as SRT
log_info "Extracting to SRT format..."
if extract_subtitle "$TEST_FILE" "$FULL_TRACK" "$SRT_FILE"; then
    if verify_subtitle "$SRT_FILE"; then
        log_success "SRT extraction successful!"
        SRT_SIZE=$(du -h "$SRT_FILE" | cut -f1)
        SRT_LINES=$(wc -l < "$SRT_FILE")
        echo "  File: $SRT_FILE"
        echo "  Size: $SRT_SIZE"
        echo "  Lines: $SRT_LINES"
        echo ""
        echo "  First few lines:"
        head -15 "$SRT_FILE" | sed 's/^/    /'
    else
        log_error "SRT file validation failed!"
        exit 1
    fi
else
    log_error "SRT extraction failed!"
    exit 1
fi

echo ""

# Extract as ASS
log_info "Extracting to ASS format..."
if extract_subtitle "$TEST_FILE" "$FULL_TRACK" "$ASS_FILE"; then
    if verify_subtitle "$ASS_FILE"; then
        log_success "ASS extraction successful!"
        ASS_SIZE=$(du -h "$ASS_FILE" | cut -f1)
        ASS_LINES=$(wc -l < "$ASS_FILE")
        echo "  File: $ASS_FILE"
        echo "  Size: $ASS_SIZE"
        echo "  Lines: $ASS_LINES"
    else
        log_error "ASS file validation failed!"
        exit 1
    fi
else
    log_error "ASS extraction failed!"
    exit 1
fi

echo ""

# Test upload (to test folder)
log_info "Testing upload to DO Spaces (test folder)..."
SHOW_SLUG=$(show_to_slug "$TEST_SHOW")
TEST_UPLOAD_NAME="TEST-$(basename "$SRT_FILE")"

if s3cmd put --acl-public "$SRT_FILE" "s3://wakaru-media/test/$TEST_UPLOAD_NAME" 2>&1 | grep -q "upload"; then
    log_success "Upload successful!"
    CDN_URL="https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/test/$TEST_UPLOAD_NAME"
    echo "  URL: $CDN_URL"
    echo ""
    
    # Test download
    log_info "Testing download from CDN..."
    if curl -s -I "$CDN_URL" | grep -q "200 OK"; then
        log_success "CDN access verified!"
    else
        log_warning "CDN access check failed (might take a moment to propagate)"
    fi
else
    log_error "Upload failed!"
    exit 1
fi

echo ""
echo "========================================"
log_success "All tests passed!"
echo "========================================"
echo ""
echo "Test files saved to: $OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "  1. Review the extracted subtitles"
echo "  2. Verify they display correctly"
echo "  3. Run full extraction: ./extract-subtitles.sh --all"
