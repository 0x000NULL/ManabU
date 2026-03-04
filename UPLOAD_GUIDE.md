# Wakaru Media Upload Quick Reference

## Prerequisites

✅ Bucket created: `wakaru-media`  
✅ s3cmd configured: `~/.s3cfg`  
✅ Folder structure created (run `complete-spaces-setup.sh`)

## Quick Upload Commands

### Single Video File

```bash
s3cmd put --acl-public \
    --mime-type='video/mp4' \
    episode01.mp4 \
    s3://wakaru-media/videos/shirokuma-cafe/episode01.mp4
```

### Single Subtitle File

```bash
s3cmd put --acl-public \
    --mime-type='text/vtt' \
    episode01.vtt \
    s3://wakaru-media/subtitles/shirokuma-cafe/episode01.vtt
```

### Batch Upload Directory

```bash
# Upload all MP4 files from current directory
s3cmd put --acl-public \
    --mime-type='video/mp4' \
    *.mp4 \
    s3://wakaru-media/videos/shirokuma-cafe/

# Sync entire directory
s3cmd sync --acl-public \
    ./local-videos/ \
    s3://wakaru-media/videos/takagi-san/
```

## Show Name Mappings

| Show Name | Folder Name |
|-----------|-------------|
| Shirokuma Cafe | `shirokuma-cafe` |
| Takagi-san | `takagi-san` |
| Terrace House | `terrace-house` |
| Death Note | `death-note` |
| Evangelion | `evangelion` |

## File Naming Convention

**Recommended format:**
```
videos/[show]/s[season]e[episode].mp4
subtitles/[show]/s[season]e[episode].vtt
```

**Examples:**
```
videos/shirokuma-cafe/s01e01.mp4
videos/takagi-san/s02e03.mp4
subtitles/death-note/s01e01.vtt
```

## Access URLs

### CDN URLs (Recommended)

```
https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/videos/[show]/[file].mp4
https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/subtitles/[show]/[file].vtt
```

### Direct URLs (Fallback)

```
https://wakaru-media.sfo3.digitaloceanspaces.com/videos/[show]/[file].mp4
https://wakaru-media.sfo3.digitaloceanspaces.com/subtitles/[show]/[file].vtt
```

## Common Tasks

### List Files in Bucket

```bash
# List all files
s3cmd ls s3://wakaru-media/

# List videos for a show
s3cmd ls s3://wakaru-media/videos/shirokuma-cafe/

# Recursive listing
s3cmd ls -r s3://wakaru-media/
```

### Delete a File

```bash
s3cmd del s3://wakaru-media/videos/show-name/episode.mp4
```

### Get File Info

```bash
s3cmd info s3://wakaru-media/videos/show-name/episode.mp4
```

### Change File Permissions

```bash
# Make a file public
s3cmd setacl --acl-public s3://wakaru-media/videos/show/episode.mp4

# Make a file private
s3cmd setacl --acl-private s3://wakaru-media/videos/show/episode.mp4
```

### Download a File

```bash
s3cmd get s3://wakaru-media/videos/show/episode.mp4 ./local-file.mp4
```

## Video Encoding Recommendations

### For 480p (Budget-friendly)

```bash
ffmpeg -i input.mkv \
    -vf scale=854:480 \
    -c:v libx264 -crf 23 -preset medium \
    -c:a aac -b:a 128k \
    output.mp4
```

### For 720p (Balanced)

```bash
ffmpeg -i input.mkv \
    -vf scale=1280:720 \
    -c:v libx264 -crf 23 -preset medium \
    -c:a aac -b:a 192k \
    output.mp4
```

### Convert Subtitles to VTT

```bash
# From SRT
ffmpeg -i subtitles.srt subtitles.vtt

# From ASS/SSA
ffmpeg -i subtitles.ass subtitles.vtt
```

## Troubleshooting

### "Access Denied" Error

**Solution:** Verify the key has grants for the bucket

```bash
# Check via API
curl -H "Authorization: Bearer YOUR_DO_API_TOKEN" \
    https://api.digitalocean.com/v2/spaces/keys/YOUR_SPACES_KEY_ID
```

### "Connection Refused" Error

**Solution:** Check s3cmd configuration

```bash
cat ~/.s3cfg
# Should have:
# host_base = sfo3.digitaloceanspaces.com
# host_bucket = %(bucket)s.sfo3.digitaloceanspaces.com
```

### Video Won't Play in Browser

**Possible causes:**
1. **MIME type not set:** Re-upload with `--mime-type='video/mp4'`
2. **CORS not configured:** Run CORS setup from `complete-spaces-setup.sh`
3. **File not public:** Re-upload with `--acl-public`
4. **Wrong codec:** Re-encode with H.264 (see encoding commands above)

### Slow Upload Speed

**Tips:**
1. Use `--multipart-chunk-size-mb=100` for large files
2. Upload during off-peak hours
3. Check your internet connection speed

```bash
s3cmd put --acl-public \
    --multipart-chunk-size-mb=100 \
    large-video.mp4 \
    s3://wakaru-media/videos/show/
```

## Cost Monitoring

### Estimate Storage Cost

```bash
# Get bucket size
s3cmd du -H s3://wakaru-media/

# Example: 250 GB = $5.00/month @ $0.02/GB
```

### Monitor Usage

Check DigitalOcean dashboard:
- https://cloud.digitalocean.com/spaces
- Click on `wakaru-media`
- View "Storage" and "Bandwidth" tabs

## Automation Scripts

### Batch Upload Script

Save as `upload-show.sh`:

```bash
#!/bin/bash
SHOW=$1
LOCAL_DIR=$2

if [ -z "$SHOW" ] || [ -z "$LOCAL_DIR" ]; then
    echo "Usage: $0 <show-name> <local-directory>"
    echo "Example: $0 shirokuma-cafe ./videos/shirokuma/"
    exit 1
fi

echo "Uploading videos from $LOCAL_DIR to $SHOW..."
s3cmd put --acl-public --mime-type='video/mp4' \
    $LOCAL_DIR/*.mp4 \
    s3://wakaru-media/videos/$SHOW/

echo "Uploading subtitles from $LOCAL_DIR to $SHOW..."
s3cmd put --acl-public --mime-type='text/vtt' \
    $LOCAL_DIR/*.vtt \
    s3://wakaru-media/subtitles/$SHOW/

echo "✅ Done! Files uploaded to:"
echo "   Videos: https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/videos/$SHOW/"
echo "   Subtitles: https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/subtitles/$SHOW/"
```

Make executable:
```bash
chmod +x upload-show.sh
```

Use:
```bash
./upload-show.sh shirokuma-cafe ./local-videos/shirokuma/
```

## Integration Example (JavaScript)

```javascript
// Wakaru video player integration

class WakaruMedia {
  constructor() {
    this.baseURL = 'https://wakaru-media.sfo3.cdn.digitaloceanspaces.com';
  }

  getVideoURL(show, season, episode) {
    const file = `s${season.toString().padStart(2, '0')}e${episode.toString().padStart(2, '0')}.mp4`;
    return `${this.baseURL}/videos/${show}/${file}`;
  }

  getSubtitleURL(show, season, episode) {
    const file = `s${season.toString().padStart(2, '0')}e${episode.toString().padStart(2, '0')}.vtt`;
    return `${this.baseURL}/subtitles/${show}/${file}`;
  }
}

// Usage
const media = new WakaruMedia();
const videoURL = media.getVideoURL('shirokuma-cafe', 1, 1);
const subURL = media.getSubtitleURL('shirokuma-cafe', 1, 1);

console.log(videoURL);
// https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/videos/shirokuma-cafe/s01e01.mp4
```

---

**Quick Links:**
- [Full Setup Documentation](./DO_SPACES_SETUP.md)
- [Complete Setup Script](./complete-spaces-setup.sh)
- [DigitalOcean Spaces Console](https://cloud.digitalocean.com/spaces)
