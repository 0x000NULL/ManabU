#!/bin/bash
# Wakaru Subtitle Extraction Script
# Extracts English subtitles from anime MKV files and uploads to DO Spaces

set -euo pipefail

# Source helper functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/subtitle-extraction-helpers.sh"

# Configuration
ANIME_BASE="/mnt/ClusterFS/MEDIA/Anime"
WORKSPACE="$HOME/.openclaw/workspace/Wakaru"
OUTPUT_DIR="$WORKSPACE/subtitles"
STATE_FILE="$WORKSPACE/extraction-state.json"
ERROR_LOG="$WORKSPACE/extraction-errors.log"
MANIFEST_FILE="$WORKSPACE/subtitle-manifest.json"

# Default settings
DRY_RUN=false
NO_UPLOAD=false
UPLOAD_ONLY=false
SPECIFIC_SHOW=""
PARALLEL_JOBS=1
OUTPUT_FORMAT="srt"  # srt or ass

# Show list
SHOWS=(
    "Death Note"
    "Odd Taxi"
    "Haikyuu!!"
    "Wangan Midnight"
    "Food Wars!"
    "Initial D"
)

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --show)
                SPECIFIC_SHOW="$2"
                shift 2
                ;;
            --all)
                SPECIFIC_SHOW=""
                shift
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            --no-upload)
                NO_UPLOAD=true
                shift
                ;;
            --upload-only)
                UPLOAD_ONLY=true
                shift
                ;;
            --parallel)
                PARALLEL_JOBS="$2"
                shift 2
                ;;
            --format)
                OUTPUT_FORMAT="$2"
                shift 2
                ;;
            -h|--help)
                show_usage
                exit 0
                ;;
            *)
                echo "Unknown option: $1"
                show_usage
                exit 1
                ;;
        esac
    done
}

show_usage() {
    cat <<EOF
Usage: $0 [OPTIONS]

Extract subtitles from Wakaru anime MKV files and upload to DO Spaces.

OPTIONS:
    --show NAME         Process only specific show
    --all              Process all shows (default)
    --dry-run          Show what would be done without doing it
    --no-upload        Extract only, don't upload to DO Spaces
    --upload-only      Upload previously extracted subtitles
    --parallel N       Process N files in parallel (default: 1)
    --format FMT       Output format: srt or ass (default: srt)
    -h, --help         Show this help message

EXAMPLES:
    $0 --show "Death Note"
    $0 --all --dry-run
    $0 --parallel 4 --format srt
    $0 --upload-only

EOF
}

# Initialize workspace
init_workspace() {
    mkdir -p "$OUTPUT_DIR"
    mkdir -p "$(dirname "$STATE_FILE")"
    
    # Initialize state file if it doesn't exist
    if [ ! -f "$STATE_FILE" ]; then
        echo '{"processed": {}, "failed": {}}' > "$STATE_FILE"
    fi
    
    # Initialize manifest if it doesn't exist
    if [ ! -f "$MANIFEST_FILE" ]; then
        echo '{}' > "$MANIFEST_FILE"
    fi
    
    # Clear error log for new run
    if [ "$UPLOAD_ONLY" = false ]; then
        > "$ERROR_LOG"
    fi
}

# Check if file has already been processed
is_processed() {
    local mkv_file="$1"
    local show_slug="$2"
    local basename=$(basename "$mkv_file" .mkv)
    local subtitle_file="$OUTPUT_DIR/${show_slug}/${basename}-en.$OUTPUT_FORMAT"
    
    # Check if subtitle file exists
    if [ -f "$subtitle_file" ]; then
        return 0
    fi
    
    return 1
}

# Process a single MKV file
process_file() {
    local mkv_file="$1"
    local show_name="$2"
    local show_slug="$3"
    local file_num="$4"
    local total_files="$5"
    
    local basename=$(basename "$mkv_file" .mkv)
    local output_subdir="$OUTPUT_DIR/${show_slug}"
    local subtitle_file="${output_subdir}/${basename}-en.$OUTPUT_FORMAT"
    
    # Create output directory
    mkdir -p "$output_subdir"
    
    echo ""
    log_info "[$file_num/$total_files] $(basename "$mkv_file")"
    
    # Skip if already processed (resumability)
    if is_processed "$mkv_file" "$show_slug" && [ "$UPLOAD_ONLY" = false ]; then
        log_warning "Already extracted, skipping"
        return 0
    fi
    
    if [ "$UPLOAD_ONLY" = false ]; then
        # Get subtitle tracks
        local tracks=$(get_subtitle_tracks "$mkv_file")
        
        if [ -z "$tracks" ]; then
            log_error "No subtitle tracks found"
            echo "$(date): $mkv_file - No subtitle tracks" >> "$ERROR_LOG"
            return 1
        fi
        
        # Find the full subtitle track
        local track_index=$(find_full_subtitle_track "$mkv_file")
        
        if [ -z "$track_index" ]; then
            log_error "Could not identify subtitle track"
            echo "$(date): $mkv_file - Could not identify track" >> "$ERROR_LOG"
            return 1
        fi
        
        local track_info=$(echo "$tracks" | grep "^$track_index,")
        log_info "Detected: track $track_index - $track_info"
        
        if [ "$DRY_RUN" = true ]; then
            log_info "[DRY RUN] Would extract to: $subtitle_file"
            return 0
        fi
        
        # Extract subtitle
        log_info "Extracting to $OUTPUT_FORMAT..."
        if extract_subtitle "$mkv_file" "$track_index" "$subtitle_file"; then
            if verify_subtitle "$subtitle_file"; then
                log_success "Extracted: $(basename "$subtitle_file")"
            else
                log_error "Extraction failed - invalid subtitle file"
                rm -f "$subtitle_file"
                echo "$(date): $mkv_file - Invalid subtitle output" >> "$ERROR_LOG"
                return 1
            fi
        else
            log_error "FFmpeg extraction failed"
            echo "$(date): $mkv_file - FFmpeg failed" >> "$ERROR_LOG"
            return 1
        fi
    fi
    
    # Upload to DO Spaces
    if [ "$NO_UPLOAD" = false ] && [ "$DRY_RUN" = false ]; then
        if [ -f "$subtitle_file" ]; then
            log_info "Uploading to DO Spaces..."
            local upload_filename="$(basename "$subtitle_file")"
            if upload_to_spaces "$subtitle_file" "$show_slug" "$upload_filename"; then
                local cdn_url=$(get_cdn_url "$show_slug" "$upload_filename")
                log_success "Uploaded: $cdn_url"
            else
                log_error "Upload failed"
                echo "$(date): $subtitle_file - Upload failed" >> "$ERROR_LOG"
                return 1
            fi
        else
            log_error "Subtitle file not found for upload: $subtitle_file"
            return 1
        fi
    fi
    
    return 0
}

# Process a show
process_show() {
    local show_name="$1"
    local show_dir="$ANIME_BASE/$show_name"
    local show_slug=$(show_to_slug "$show_name")
    
    if [ ! -d "$show_dir" ]; then
        log_warning "Directory not found: $show_dir"
        return 1
    fi
    
    log_info "Processing: $show_name"
    
    # Find all MKV files
    local mkv_files=()
    while IFS= read -r -d '' file; do
        mkv_files+=("$file")
    done < <(find "$show_dir" -name "*.mkv" -type f -print0 2>/dev/null | sort -z)
    
    local total_files=${#mkv_files[@]}
    
    if [ $total_files -eq 0 ]; then
        log_warning "No MKV files found in $show_dir"
        return 1
    fi
    
    log_info "Found $total_files video file(s)"
    
    # Process files
    local file_num=1
    local success_count=0
    local fail_count=0
    
    for mkv_file in "${mkv_files[@]}"; do
        if process_file "$mkv_file" "$show_name" "$show_slug" $file_num $total_files; then
            ((success_count++))
        else
            ((fail_count++))
        fi
        ((file_num++))
    done
    
    echo ""
    log_info "$show_name Summary: $success_count succeeded, $fail_count failed"
    
    return 0
}

# Main execution
main() {
    parse_args "$@"
    
    echo "========================================"
    echo "   Wakaru Subtitle Extraction"
    echo "========================================"
    echo ""
    
    if [ "$DRY_RUN" = true ]; then
        log_warning "DRY RUN MODE - No files will be modified"
        echo ""
    fi
    
    init_workspace
    
    # Determine which shows to process
    local shows_to_process=()
    if [ -n "$SPECIFIC_SHOW" ]; then
        shows_to_process=("$SPECIFIC_SHOW")
    else
        shows_to_process=("${SHOWS[@]}")
    fi
    
    local show_num=1
    local total_shows=${#shows_to_process[@]}
    
    for show in "${shows_to_process[@]}"; do
        echo ""
        log_info "[$show_num/$total_shows] $show"
        echo "========================================="
        process_show "$show"
        ((show_num++))
    done
    
    echo ""
    echo "========================================"
    log_success "Extraction complete!"
    echo ""
    
    if [ -s "$ERROR_LOG" ]; then
        log_warning "Errors occurred. See: $ERROR_LOG"
        echo ""
        echo "Error summary:"
        tail -20 "$ERROR_LOG"
    fi
    
    echo ""
    log_info "Output directory: $OUTPUT_DIR"
    log_info "Manifest file: $MANIFEST_FILE"
}

# Run main
main "$@"
