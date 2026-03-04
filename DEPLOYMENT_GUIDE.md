# Wakaru Immersion System - Video Deployment Guide

## 📦 Upload Media to DigitalOcean Spaces

### 1. Create DigitalOcean Space

```bash
# In DigitalOcean Dashboard:
# - Create Spaces bucket (e.g., wakaru-media)
# - Region: Pick closest to you (SFO3 for Las Vegas)
# - Enable CDN (faster delivery)
# - Set ACL to "Public" for video files (you're the only user)
```

### 2. Install s3cmd CLI Tool

```bash
# Ubuntu/Debian
sudo apt install s3cmd

# Configure with your DO Spaces credentials
s3cmd --configure
# Enter:
# - Access Key: From DO API settings
# - Secret Key: From DO API settings
# - Default Region: sfo3 (or your chosen region)
# - S3 Endpoint: sfo3.digitaloceanspaces.com
# - DNS-style bucket: %(bucket)s.sfo3.digitaloceanspaces.com
```

### 3. Upload Video Files

**Recommended folder structure in Spaces:**

```
wakaru-media/
├── videos/
│   ├── shirokuma-cafe/
│   │   ├── ep01.mp4
│   │   ├── ep02.mp4
│   │   └── ...
│   ├── takagi-san/
│   │   └── ...
│   └── ...
└── subtitles/
    ├── shirokuma-cafe/
    │   ├── ep01-ja.srt
    │   ├── ep01-en.srt
    │   └── ...
    └── ...
```

**Upload commands:**

```bash
# Upload videos (with progress bar)
s3cmd put --acl-public --progress \
  /path/to/shirokuma-cafe-ep01.mp4 \
  s3://wakaru-media/videos/shirokuma-cafe/ep01.mp4

# Upload subtitles
s3cmd put --acl-public --progress \
  /path/to/shirokuma-cafe-ep01-ja.srt \
  s3://wakaru-media/subtitles/shirokuma-cafe/ep01-ja.srt

# Upload entire folder at once
s3cmd put --recursive --acl-public \
  /path/to/shirokuma-cafe/ \
  s3://wakaru-media/videos/shirokuma-cafe/
```

**Result:** Files accessible at:
```
https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/videos/shirokuma-cafe/ep01.mp4
https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/subtitles/shirokuma-cafe/ep01-ja.srt
```

---

## 🔧 Update Wakaru Code to Use Your URLs

### 4. Edit `media-data.ts`

**File:** `~/.openclaw/workspace/Wakaru/src/lib/constants/media-data.ts`

**Change subtitle URLs from:**
```typescript
subtitle_ja_url: '/subtitles/shirokuma-cafe/ep01-ja.srt',
subtitle_en_url: '/subtitles/shirokuma-cafe/ep01-en.srt',
```

**To your DO Spaces URLs:**
```typescript
subtitle_ja_url: 'https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/subtitles/shirokuma-cafe/ep01-ja.srt',
subtitle_en_url: 'https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/subtitles/shirokuma-cafe/ep01-en.srt',
```

### 5. Add Video URLs to Episodes

Currently episodes don't have a `video_url` field. You need to:

**A) Add video_url field to database schema:**

Edit `~/.openclaw/workspace/Wakaru/prisma/schema.prisma`:

```prisma
model MediaEpisode {
  id               String   @id @default(cuid())
  media_id         String
  episode_number   Int
  title            String?
  duration_seconds Int?
  video_url        String?  // ADD THIS LINE
  subtitle_ja_url  String?
  subtitle_en_url  String?
  created_at       DateTime @default(now())

  media            MediaContent @relation(fields: [media_id], references: [id], onDelete: Cascade)
  user_progress    UserMediaProgress[]

  @@unique([media_id, episode_number])
  @@map("media_episodes")
}
```

**B) Run migration:**

```bash
cd ~/.openclaw/workspace/Wakaru
npx prisma migrate dev --name add_video_url
```

**C) Update `media-data.ts` episodes:**

```typescript
episodes: [
  {
    episode_number: 1,
    title: 'しろくまカフェへようこそ',
    title_english: 'Welcome to Shirokuma Cafe',
    duration_seconds: 1440,
    video_url: 'https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/videos/shirokuma-cafe/ep01.mp4',  // ADD THIS
    subtitle_ja_url: 'https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/subtitles/shirokuma-cafe/ep01-ja.srt',
    subtitle_en_url: 'https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/subtitles/shirokuma-cafe/ep01-en.srt',
  },
  // ... rest of episodes
]
```

**D) Update TypeScript types:**

Edit `~/.openclaw/workspace/Wakaru/src/types/media.ts`:

```typescript
export interface EpisodeData {
  episode_number: number
  title: string
  title_english?: string
  duration_seconds: number
  video_url?: string  // ADD THIS
  subtitle_ja_url?: string
  subtitle_en_url?: string
}
```

### 6. Re-seed Database

```bash
cd ~/.openclaw/workspace/Wakaru
npx prisma db seed
```

---

## 🎥 Update Video Player to Load From Database

**File:** `~/.openclaw/workspace/Wakaru/src/app/(dashboard)/immersion/watch/[mediaId]/[episodeNumber]/page.tsx`

Ensure it fetches `video_url` from the database and passes to VideoPlayer component:

```typescript
const episode = await prisma.mediaEpisode.findUnique({
  where: {
    media_id_episode_number: {
      media_id: params.mediaId,
      episode_number: parseInt(params.episodeNumber)
    }
  },
  select: {
    id: true,
    title: true,
    video_url: true,  // ADD THIS
    subtitle_ja_url: true,
    subtitle_en_url: true,
    // ...
  }
})

// Later in component:
<VideoPlayer
  src={episode.video_url ?? null}  // PASS VIDEO URL HERE
  // ...
/>
```

---

## 🔨 What Else Needs to Be Built?

### ✅ Already Built (90% Complete)

- [x] Video player component with playback controls
- [x] Subtitle sync engine (SRT + ASS support)
- [x] Interactive word lookup (click-to-define)
- [x] Sentence mining modal
- [x] Screenshot capture (canvas-based)
- [x] Keyboard shortcuts (space, j/e, a/d, l, s, r, m, f)
- [x] Loop mode for subtitle repetition
- [x] Progress tracking (resume playback)

### ⏳ TODO for Full Launch (Phase 1E → 1F)

#### **Critical (Required for Basic Functionality):**

1. **Audio Clip Extraction** ⚠️ NOT BUILT
   - **Problem:** Screenshot capture works, but audio clips aren't extracted
   - **What's needed:**
     - Backend API endpoint to extract 3-5 second audio clip from video
     - Tool: `ffmpeg` (already available in most systems)
     - Trigger: When user mines a sentence, extract audio from `timestamp - 1s` to `timestamp + 4s`
   
   **Implementation:**
   ```typescript
   // New API route: /api/v1/media/extract-audio
   // Uses ffmpeg to clip audio:
   // ffmpeg -ss START_TIME -i VIDEO_URL -t 5 -q:a 0 output.mp3
   ```

2. **Fix Subtitle Loading** ⚠️ ISSUE
   - **Current code** loads subtitles from `public/subtitles/...` (local filesystem)
   - **Your setup** needs to load from DO Spaces URLs (remote HTTPS)
   - **Fix:** Update `loadSubtitles()` in `subtitle-parser.ts`:
   
   ```typescript
   // BEFORE (filesystem):
   const filePath = path.join(process.cwd(), 'public', subtitleUrl)
   const content = await readFile(filePath, 'utf-8')
   
   // AFTER (remote fetch):
   const response = await fetch(subtitleUrl)
   if (!response.ok) return null
   const content = await response.text()
   ```

3. **CORS Configuration for DO Spaces**
   - Videos/subtitles must allow cross-origin requests
   - **Fix:** In DigitalOcean Spaces settings:
     - Go to your bucket → Settings → CORS Configurations
     - Add:
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

#### **Important (For Better UX):**

4. **Persistent Mined Sentences**
   - Mining modal saves to database, but there's no "My Mined Sentences" page yet
   - **Needed:** Build `/immersion/mined` page to view/edit/delete saved sentences
   - **Status:** Backend API exists (`/api/v1/sentences/mine`), frontend page missing

5. **Dashboard Stats**
   - "Total immersion time" widget
   - "Sentences mined this week" counter
   - **Status:** Data is tracked in `user_study_sessions`, just needs dashboard UI

6. **Mobile Optimization**
   - Video player works on mobile, but touch controls need refinement
   - Dictionary popup positioning on small screens

7. **Deployment to Production**
   - Currently runs on `localhost:3000`
   - Deploy to Vercel or Railway
   - Set environment variables for database connection

#### **Nice-to-Have (Post-Launch):**

8. Audio playback speed control (independent of video speed)
9. Export mined sentences to Anki deck
10. Furigana display toggle for subtitles
11. Auto-pause on unknown words (advanced learners)

---

## 📋 Quick Start Checklist

```bash
# 1. Create DigitalOcean Space
# (Do in dashboard: wakaru-media, public ACL, CDN enabled)

# 2. Upload one test video + subtitles
s3cmd put --acl-public ~/Downloads/shirokuma-ep01.mp4 \
  s3://wakaru-media/videos/shirokuma-cafe/ep01.mp4

s3cmd put --acl-public ~/Downloads/shirokuma-ep01-ja.srt \
  s3://wakaru-media/subtitles/shirokuma-cafe/ep01-ja.srt

# 3. Update Wakaru code
cd ~/.openclaw/workspace/Wakaru

# Add video_url to schema
npx prisma migrate dev --name add_video_url

# Edit media-data.ts with your DO Spaces URLs
nano src/lib/constants/media-data.ts

# Fix subtitle loader for remote URLs
nano src/lib/utils/subtitle-parser.ts
# (Replace readFile with fetch)

# Re-seed database
npx prisma db seed

# 4. Configure CORS in DO Spaces dashboard
# (Settings → CORS → Add rule for GET/HEAD from *)

# 5. Start dev server
npm run dev

# 6. Test at http://localhost:3000/immersion
```

---

## 💾 Storage Cost Estimate

**DigitalOcean Spaces Pricing:**
- $5/month for 250 GB storage + 1 TB transfer
- You're the only user, so transfer will be minimal
- Estimated cost: **$5-10/month** (depending on how much media you upload)

**Example capacity at $5/month:**
- ~50 hours of 720p video (5 GB/hour avg)
- OR ~100 hours of 480p video (2.5 GB/hour avg)
- Unlimited subtitle files (tiny, <100 KB each)

---

## 🚀 Minimum Viable Launch

**To get immersion working TODAY:**

1. ✅ Upload 1 episode + subtitles to DO Spaces (5 min)
2. ✅ Add `video_url` field to schema (2 min)
3. ✅ Update `media-data.ts` with DO URLs (5 min)
4. ⚠️ Fix subtitle loader to use `fetch()` instead of `readFile()` (5 min)
5. ✅ Configure CORS in DO Spaces (2 min)
6. ✅ Re-seed database (1 min)
7. ✅ Test video playback (2 min)

**Total time:** ~25 minutes to get first video playing with interactive subtitles.

**Audio extraction** can wait — screenshots + text are 80% of the value. You can manually add audio clips later if needed.

---

Want me to write the exact code changes for the subtitle loader fix and audio extraction API?
