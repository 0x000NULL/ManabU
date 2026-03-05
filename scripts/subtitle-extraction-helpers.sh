#!/bin/bash
# Subtitle Extraction Helper Functions

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Get subtitle track information from MKV file
# Returns: track_index|codec|language|title
get_subtitle_tracks() {
    local mkv_file="$1"
    ffprobe -v error -select_streams s -show_entries stream=index,codec_name:stream_tags=language,title -of csv=p=0 "$mkv_file" 2>/dev/null
}

# Find the "full subtitles" track (not signs/songs)
# Returns: track index
find_full_subtitle_track() {
    local mkv_file="$1"
    local tracks=$(get_subtitle_tracks "$mkv_file")
    
    # Look for full subtitles (not signs/songs)
    local full_track=$(echo "$tracks" | grep -iE "(full|english)" | grep -ivE "(sign|song)" | head -1 | cut -d',' -f1)
    
    # If not found, just get the last English track
    if [ -z "$full_track" ]; then
        full_track=$(echo "$tracks" | grep -i "eng" | tail -1 | cut -d',' -f1)
    fi
    
    # If still not found, get the first subtitle track
    if [ -z "$full_track" ]; then
        full_track=$(echo "$tracks" | head -1 | cut -d',' -f1)
    fi
    
    echo "$full_track"
}

# Extract subtitle track to file
# Args: mkv_file, track_index, output_file
extract_subtitle() {
    local mkv_file="$1"
    local track_index="$2"
    local output_file="$3"
    
    # Determine output format from extension
    local ext="${output_file##*.}"
    
    if [ "$ext" = "srt" ]; then
        # Convert to SRT
        ffmpeg -v error -i "$mkv_file" -map 0:$track_index -c:s srt "$output_file" -y 2>&1
    else
        # Copy as-is (ASS)
        ffmpeg -v error -i "$mkv_file" -map 0:$track_index -c:s copy "$output_file" -y 2>&1
    fi
    
    return $?
}

# Verify subtitle file is valid
verify_subtitle() {
    local subtitle_file="$1"
    
    # Check if file exists and is not empty
    if [ ! -f "$subtitle_file" ] || [ ! -s "$subtitle_file" ]; then
        return 1
    fi
    
    # Check if file contains subtitle markers
    if grep -qE "(^\[|^[0-9]{2}:[0-9]{2})" "$subtitle_file"; then
        return 0
    fi
    
    return 1
}

# Convert show directory name to slug for DO Spaces
show_to_slug() {
    local show_name="$1"
    echo "$show_name" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -d '!:?'
}

# Get episode identifier from filename
# Example: "Death Note - 01x14 - Friend.mkv" -> "01x14"
get_episode_id() {
    local filename="$1"
    # Try to extract SxxExx or xxxyy pattern
    if echo "$filename" | grep -qoE "[0-9]{2}x[0-9]{2}"; then
        echo "$filename" | grep -oE "[0-9]{2}x[0-9]{2}" | head -1
    elif echo "$filename" | grep -qoE "[0-9]{1,2}"; then
        # Just extract first number as episode
        local ep=$(echo "$filename" | grep -oE "[0-9]+" | head -1)
        printf "ep%02d" "$ep"
    else
        echo "unknown"
    fi
}

# Upload subtitle to DO Spaces
# Args: local_file, show_slug, filename
upload_to_spaces() {
    local local_file="$1"
    local show_slug="$2"
    local filename="$3"
    
    local remote_path="s3://wakaru-media/subtitles/${show_slug}/${filename}"
    
    s3cmd put --acl-public "$local_file" "$remote_path" 2>&1 | grep -v "WARNING"
    return ${PIPESTATUS[0]}
}

# Get CDN URL for uploaded subtitle
get_cdn_url() {
    local show_slug="$1"
    local filename="$2"
    echo "https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/subtitles/${show_slug}/${filename}"
}

# Count total MKV files in directory
count_mkv_files() {
    local dir="$1"
    find "$dir" -name "*.mkv" -type f 2>/dev/null | wc -l
}

# Format time duration
format_duration() {
    local seconds=$1
    printf "%02d:%02d:%02d" $((seconds/3600)) $((seconds%3600/60)) $((seconds%60))
}
