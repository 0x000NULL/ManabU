# DigitalOcean Spaces Setup for Wakaru Media Hosting

**Status:** Partial - Manual bucket creation required

## Current Situation

- ✅ s3cmd installed
- ✅ DigitalOcean API token configured
- ✅ Spaces access key created
- ⚠️ **Bucket needs manual creation** (API limitation)

## Spaces Access Credentials

```
Access Key: DO801VX99HBKJLXGTFZK
Secret Key: 4uvacYSQJtz6q8tdhgm3vHsMeam5YMdouvbfsMy1BAo
Region: sfo3
Key Name: wakaru-media-fullaccess
```

**Note:** These credentials are stored in `~/.s3cfg` for s3cmd usage.

## Step 1: Manual Bucket Creation (Required)

DigitalOcean Spaces buckets cannot be created via API with restricted keys. Please create the bucket manually:

1. Visit: https://cloud.digitalocean.com/spaces
2. Click "Create a Space"
3. Configure:
   - **Region:** San Francisco 3 (SFO3)
   - **Bucket Name:** `wakaru-media`
   - **Enable CDN:** YES
   - **File Listing:** Enabled (for public access)
   - **Restrict File Listing:** Disabled (single user, no concerns)

## Step 2: Grant Access to Key

After creating the bucket, grant access to the key:

1. In DigitalOcean control panel, go to: API → Spaces Keys
2. Find key: "wakaru-media-fullaccess" (DO801VX99HBKJLXGTFZK)
3. Click "Edit" → Add Grant:
   - **Bucket:** wakaru-media
   - **Permission:** Read and Write

Alternatively, use the API (replace with actual command once bucket exists):

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_DO_API_TOKEN" \
  -d '{"name":"wakaru-media-fullaccess","grants":[{"bucket":"wakaru-media","permission":"readwrite"}]}' \
  "https://api.digitalocean.com/v2/spaces/keys/YOUR_SPACES_KEY_ID"
```

## Step 3: Configure s3cmd (Already Done)

s3cmd is configured at `~/.s3cfg`:

```ini
[default]
access_key = DO801VX99HBKJLXGTFZK
secret_key = 4uvacYSQJtz6q8tdhgm3vHsMeam5YMdouvbfsMy1BAo
host_base = sfo3.digitaloceanspaces.com
host_bucket = %(bucket)s.sfo3.digitaloceanspaces.com
use_https = True
signature_v2 = False
bucket_location = us-east-1
```

## Step 4: Test Upload (After Manual Creation)

Once the bucket is created and grants are set:

```bash
# Test with a dummy file
echo "test" > /tmp/wakaru-test.txt
s3cmd put /tmp/wakaru-test.txt s3://wakaru-media/test.txt

# Verify
s3cmd ls s3://wakaru-media/

# Clean up test
s3cmd del s3://wakaru-media/test.txt
rm /tmp/wakaru-test.txt
```

## Step 5: Create Folder Structure

Create the folder structure for organized media storage:

```bash
# Create directory markers (S3 doesn't have true folders, but this helps)
for show in shirokuma-cafe takagi-san terrace-house death-note evangelion; do
  echo "" | s3cmd put - s3://wakaru-media/videos/$show/.keep
  echo "" | s3cmd put - s3://wakaru-media/subtitles/$show/.keep
done
```

**Folder Structure:**
```
wakaru-media/
├── videos/
│   ├── shirokuma-cafe/
│   ├── takagi-san/
│   ├── terrace-house/
│   ├── death-note/
│   └── evangelion/
└── subtitles/
    ├── shirokuma-cafe/
    ├── takagi-san/
    ├── terrace-house/
    ├── death-note/
    └── evangelion/
```

## Step 6: Configure CORS (After Manual Creation)

Apply CORS policy for cross-origin video playback:

Create `cors.xml`:

```xml
<CORSConfiguration>
  <CORSRule>
    <AllowedOrigin>*</AllowedOrigin>
    <AllowedMethod>GET</AllowedMethod>
    <AllowedMethod>HEAD</AllowedMethod>
    <AllowedHeader>*</AllowedHeader>
  </CORSRule>
</CORSConfiguration>
```

Apply the CORS configuration:

```bash
s3cmd setcors cors.xml s3://wakaru-media
```

Verify:

```bash
s3cmd info s3://wakaru-media
```

## Step 7: Set Public Read Access (After Manual Creation)

Make files publicly accessible:

```bash
# Set default ACL to public-read for the bucket
s3cmd setacl s3://wakaru-media --acl-public

# For individual files during upload:
s3cmd put --acl-public video.mp4 s3://wakaru-media/videos/show-name/
```

## Access URLs

Once the bucket is created and configured:

### CDN URLs (Recommended - Faster)
```
https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/videos/[show-name]/[episode].mp4
https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/subtitles/[show-name]/[episode].vtt
```

### Direct URLs
```
https://wakaru-media.sfo3.digitaloceanspaces.com/videos/[show-name]/[episode].mp4
https://wakaru-media.sfo3.digitaloceanspaces.com/subtitles/[show-name]/[episode].vtt
```

**Recommendation:** Use CDN URLs for better performance and lower egress costs.

## Upload Commands

### Upload a video file:
```bash
s3cmd put --acl-public episode01.mp4 s3://wakaru-media/videos/shirokuma-cafe/
```

### Upload subtitles:
```bash
s3cmd put --acl-public episode01.vtt s3://wakaru-media/subtitles/shirokuma-cafe/
```

### Batch upload entire directory:
```bash
s3cmd sync --acl-public ./local-videos/ s3://wakaru-media/videos/shirokuma-cafe/
```

### Set MIME types (important for video playback):
```bash
s3cmd put --acl-public --mime-type='video/mp4' episode.mp4 s3://wakaru-media/videos/show/
s3cmd put --acl-public --mime-type='text/vtt' subs.vtt s3://wakaru-media/subtitles/show/
```

## Cost Estimate

Based on your usage:

**Storage:**
- 250 GB @ $0.02/GB/month = **$5.00/month**

**Egress (assuming 100 GB/month viewing):**
- First 1 TB free with CDN
- Likely **$0/month** for your usage

**Total estimated cost:** ~$5/month

**Cost savings tips:**
1. Use CDN URLs (included free egress up to 1TB)
2. Transcode videos to 480p-720p (already planned)
3. Use efficient codecs (H.264 recommended)

## Next Steps

1. ✅ **Manual action required:** Create bucket via https://cloud.digitalocean.com/spaces
2. ✅ **Manual action required:** Grant key access to bucket
3. Run test upload script
4. Create folder structure
5. Apply CORS configuration
6. Upload first test video

## Integration with Wakaru App

Update your Wakaru configuration to use these URLs:

```javascript
// Example URL construction
const SPACES_BASE_URL = 'https://wakaru-media.sfo3.cdn.digitaloceanspaces.com';

function getVideoUrl(show, episode) {
  return `${SPACES_BASE_URL}/videos/${show}/${episode}.mp4`;
}

function getSubtitleUrl(show, episode) {
  return `${SPACES_BASE_URL}/subtitles/${show}/${episode}.vtt`;
}
```

## Troubleshooting

### "Access Denied" errors:
- Verify grants are set on the key
- Check bucket ACL settings
- Ensure CDN is enabled

### CORS errors in browser:
- Verify CORS configuration is applied
- Check browser console for specific CORS errors
- Test with curl first: `curl -I <video-url>`

### Slow loading:
- Use CDN URLs instead of direct URLs
- Check video encoding settings
- Consider using adaptive bitrate streaming (HLS)

## Security Notes

- Keys are stored in `~/.s3cfg` (mode 600)
- Current setup: Public read access (appropriate for single-user, personal content)
- No copyright concerns (personal use only, 1 user)

---

**Created:** 2026-03-03  
**Last Updated:** 2026-03-03  
**Status:** Awaiting manual bucket creation
