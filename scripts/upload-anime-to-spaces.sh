#!/bin/bash
set -e

# Wakaru Media Upload Script
# Uploads anime to DigitalOcean Spaces for immersion system

BUCKET="wakaru-media"
BASE_DIR="/mnt/ClusterFS/MEDIA/Anime"
CDN_BASE="https://wakaru-media.sfo3.cdn.digitaloceanspaces.com"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "   Wakaru Anime Upload to DO Spaces"
echo "========================================"
echo ""

# Function to upload a show
upload_show() {
    local show_name="$1"
    local source_dir="$2"
    local dest_name="$3"
    
    echo -e "${BLUE}Processing: ${show_name}${NC}"
    echo "Source: $source_dir"
    echo "Destination: s3://$BUCKET/videos/$dest_name/"
    echo ""
    
    if [ ! -d "$source_dir" ]; then
        echo -e "${YELLOW}⚠ Directory not found: $source_dir${NC}"
        echo "Skipping..."
        echo ""
        return
    fi
    
    # Count video files
    local video_count=$(find "$source_dir" -type f \( -name "*.mkv" -o -name "*.mp4" -o -name "*.avi" \) | wc -l)
    echo "Found $video_count video files"
    
    if [ $video_count -eq 0 ]; then
        echo -e "${YELLOW}⚠ No video files found${NC}"
        echo ""
        return
    fi
    
    # Create destination folder marker
    echo "" | s3cmd put --acl-public - "s3://$BUCKET/videos/$dest_name/.keep" 2>/dev/null || true
    
    # Upload videos with progress
    find "$source_dir" -type f \( -name "*.mkv" -o -name "*.mp4" -o -name "*.avi" \) | sort | while read -r file; do
        local basename=$(basename "$file")
        local extension="${basename##*.}"
        
        # Generate clean filename (remove release group tags, etc.)
        local clean_name=$(echo "$basename" | sed -E 's/\[.*?\]//g' | sed -E 's/^\s+//g' | sed -E 's/\s+/_/g')
        
        echo -e "${GREEN}📤 Uploading: $basename${NC}"
        echo "   → $dest_name/$clean_name"
        
        # Upload with proper MIME type
        s3cmd put --acl-public \
            --mime-type="video/$extension" \
            --progress \
            "$file" \
            "s3://$BUCKET/videos/$dest_name/$clean_name"
        
        echo -e "${GREEN}✓ Complete${NC}"
        echo ""
    done
    
    # Upload subtitle files if they exist
    local sub_count=$(find "$source_dir" -type f \( -name "*.srt" -o -name "*.ass" -o -name "*.vtt" \) | wc -l)
    if [ $sub_count -gt 0 ]; then
        echo "Found $sub_count subtitle files"
        echo "" | s3cmd put --acl-public - "s3://$BUCKET/subtitles/$dest_name/.keep" 2>/dev/null || true
        
        find "$source_dir" -type f \( -name "*.srt" -o -name "*.ass" -o -name "*.vtt" \) | sort | while read -r file; do
            local basename=$(basename "$file")
            local clean_name=$(echo "$basename" | sed -E 's/\[.*?\]//g' | sed -E 's/^\s+//g' | sed -E 's/\s+/_/g')
            
            echo -e "${GREEN}📤 Uploading subtitle: $basename${NC}"
            s3cmd put --acl-public \
                --mime-type="text/plain" \
                "$file" \
                "s3://$BUCKET/subtitles/$dest_name/$clean_name"
        done
    fi
    
    echo -e "${GREEN}✓✓✓ $show_name upload complete!${NC}"
    echo ""
}

# Upload all shows
echo "Starting uploads..."
echo ""

# Initial D (multiple seasons - upload recursively)
upload_show "Initial D (All Seasons)" \
    "$BASE_DIR/InitialD" \
    "initial-d"

# Haikyuu!!
upload_show "Haikyuu!!" \
    "$BASE_DIR/Haikyuu!!" \
    "haikyuu"

# Odd Taxi
upload_show "Odd Taxi" \
    "$BASE_DIR/Odd Taxi" \
    "odd-taxi"

# Wangan Midnight
upload_show "Wangan Midnight" \
    "$BASE_DIR/Wangan Midnight" \
    "wangan-midnight"

# Death Note
upload_show "Death Note" \
    "$BASE_DIR/Death Note" \
    "death-note"

# Food Wars!
upload_show "Food Wars!" \
    "$BASE_DIR/Food Wars!" \
    "food-wars"

echo "========================================"
echo "   Upload Complete!"
echo "========================================"
echo ""
echo "Your anime is now available at:"
echo "${CDN_BASE}/videos/[show-name]/[episode].mkv"
echo ""
echo "Shows uploaded:"
echo "  • initial-d"
echo "  • haikyuu"
echo "  • odd-taxi"
echo "  • wangan-midnight"
echo "  • death-note"
echo "  • food-wars"
echo ""
echo "Next steps:"
echo "1. Update Wakaru media-data.ts with these URLs"
echo "2. Extract/upload subtitle files (if not embedded)"
echo "3. Test playback in Wakaru app"
echo ""
