import type { MediaContentData } from '@/types/media'

/**
 * Media Library - Immersion Content
 * 
 * NOTE: Update subtitle URLs and video URLs with your DigitalOcean Spaces URLs
 * Format: https://YOUR-BUCKET-NAME.REGION.cdn.digitaloceanspaces.com/path/to/file
 * 
 * Example:
 * - Bucket: wakaru-media
 * - Region: sfo3
 * - CDN URL: https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/subtitles/shirokuma-cafe/ep01-ja.srt
 * 
 * See DEPLOYMENT_GUIDE.md for upload instructions.
 */

export const MEDIA_LIBRARY: MediaContentData[] = [
  // ============================================================================
  // 1. しろくまカフェ (Shirokuma Cafe) — Beginner / N5
  // ============================================================================
  {
    title: 'しろくまカフェ',
    title_english: 'Shirokuma Cafe',
    type: 'anime',
    difficulty: 'beginner',
    jlpt_level: 'N5',
    description:
      'A slice-of-life comedy set in a café run by a polar bear. Features slow, clear dialogue with everyday vocabulary — perfect for absolute beginners. Characters speak politely and repeat key phrases naturally.',
    genres: ['slice-of-life', 'comedy'],
    streaming_url: 'https://www.crunchyroll.com/series/polar-bear-cafe',
    subtitle_source: 'kitsunekko / community',
    episodes: [
      {
        episode_number: 1,
        title: 'しろくまカフェへようこそ',
        title_english: 'Welcome to Shirokuma Cafe',
        duration_seconds: 1440,
        video_url: 'https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/videos/shirokuma-cafe/ep01.mp4', // TODO: Replace with your actual URL
        subtitle_ja_url: 'https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/subtitles/shirokuma-cafe/ep01-ja.srt', // TODO: Replace with your actual URL
        subtitle_en_url: 'https://wakaru-media.sfo3.cdn.digitaloceanspaces.com/subtitles/shirokuma-cafe/ep01-en.srt', // TODO: Replace with your actual URL
      },
      {
        episode_number: 2,
        title: 'パンダくんの憂鬱',
        title_english: "Panda's Melancholy",
        duration_seconds: 1440,
        subtitle_ja_url: '/subtitles/shirokuma-cafe/ep02-ja.srt',
        subtitle_en_url: '/subtitles/shirokuma-cafe/ep02-en.srt',
      },
      {
        episode_number: 3,
        title: 'グリズリーくんの野望',
        title_english: "Grizzly's Ambition",
        duration_seconds: 1440,
        subtitle_ja_url: '/subtitles/shirokuma-cafe/ep03-ja.srt',
        subtitle_en_url: '/subtitles/shirokuma-cafe/ep03-en.srt',
      },
      {
        episode_number: 4,
        title: 'みんなで花見',
        title_english: 'Cherry Blossom Viewing',
        duration_seconds: 1440,
        subtitle_ja_url: '/subtitles/shirokuma-cafe/ep04-ja.srt',
        subtitle_en_url: '/subtitles/shirokuma-cafe/ep04-en.srt',
      },
      {
        episode_number: 5,
        title: 'ペンギンさんの恋',
        title_english: "Penguin's Love",
        duration_seconds: 1440,
        subtitle_ja_url: '/subtitles/shirokuma-cafe/ep05-ja.srt',
        subtitle_en_url: '/subtitles/shirokuma-cafe/ep05-en.srt',
      },
    ],
  },

  // ============================================================================
  // 2. からかい上手の高木さん (Teasing Master Takagi-san) — Beginner / N4
  // ============================================================================
  {
    title: 'からかい上手の高木さん',
    title_english: 'Teasing Master Takagi-san',
    type: 'anime',
    difficulty: 'beginner',
    jlpt_level: 'N4',
    description:
      'A middle-school comedy about a girl who loves to tease her classmate. Simple, natural conversational Japanese with casual speech patterns. Great for learning informal everyday language.',
    genres: ['comedy', 'romance', 'school'],
    streaming_url: 'https://www.crunchyroll.com/series/teasing-master-takagi-san',
    subtitle_source: 'jimaku.cc / community',
    episodes: [
      {
        episode_number: 1,
        title: '消しゴム',
        title_english: 'Eraser',
        duration_seconds: 1440,
        subtitle_ja_url: '/subtitles/takagi-san/ep01-ja.srt',
        subtitle_en_url: '/subtitles/takagi-san/ep01-en.srt',
      },
      {
        episode_number: 2,
        title: '習字',
        title_english: 'Calligraphy',
        duration_seconds: 1440,
        subtitle_ja_url: '/subtitles/takagi-san/ep02-ja.srt',
        subtitle_en_url: '/subtitles/takagi-san/ep02-en.srt',
      },
      {
        episode_number: 3,
        title: 'コーヒー',
        title_english: 'Coffee',
        duration_seconds: 1440,
        subtitle_ja_url: '/subtitles/takagi-san/ep03-ja.srt',
        subtitle_en_url: '/subtitles/takagi-san/ep03-en.srt',
      },
      {
        episode_number: 4,
        title: '日直',
        title_english: 'Class Duty',
        duration_seconds: 1440,
        subtitle_ja_url: '/subtitles/takagi-san/ep04-ja.srt',
        subtitle_en_url: '/subtitles/takagi-san/ep04-en.srt',
      },
    ],
  },

  // ============================================================================
  // 3. テラスハウス (Terrace House) — Intermediate / N4
  // ============================================================================
  {
    title: 'テラスハウス',
    title_english: 'Terrace House',
    type: 'drama',
    difficulty: 'intermediate',
    jlpt_level: 'N4',
    description:
      'A reality show following six strangers living together in a house. Features authentic unscripted Japanese conversations at natural speed. Excellent for learning how real people speak in daily life.',
    genres: ['reality', 'slice-of-life'],
    streaming_url: 'https://www.netflix.com/title/80106847',
    subtitle_source: 'Netflix CC / community',
    episodes: [
      {
        episode_number: 1,
        title: '新しい生活の始まり',
        title_english: 'A New Beginning',
        duration_seconds: 2400,
        subtitle_ja_url: '/subtitles/terrace-house/ep01-ja.srt',
        subtitle_en_url: '/subtitles/terrace-house/ep01-en.srt',
      },
      {
        episode_number: 2,
        title: '最初の晩餐',
        title_english: 'The First Supper',
        duration_seconds: 2400,
        subtitle_ja_url: '/subtitles/terrace-house/ep02-ja.srt',
        subtitle_en_url: '/subtitles/terrace-house/ep02-en.srt',
      },
      {
        episode_number: 3,
        title: 'それぞれの夢',
        title_english: "Everyone's Dreams",
        duration_seconds: 2400,
        subtitle_ja_url: '/subtitles/terrace-house/ep03-ja.srt',
        subtitle_en_url: '/subtitles/terrace-house/ep03-en.srt',
      },
      {
        episode_number: 4,
        title: '心を開いて',
        title_english: 'Opening Up',
        duration_seconds: 2400,
        subtitle_ja_url: '/subtitles/terrace-house/ep04-ja.srt',
        subtitle_en_url: '/subtitles/terrace-house/ep04-en.srt',
      },
    ],
  },

  // ============================================================================
  // 4. デスノート (Death Note) — Intermediate / N3
  // ============================================================================
  {
    title: 'デスノート',
    title_english: 'Death Note',
    type: 'anime',
    difficulty: 'intermediate',
    jlpt_level: 'N3',
    description:
      'A psychological thriller about a student who finds a supernatural notebook. Complex vocabulary around justice, morality, and strategy. Clear enunciation but fast-paced internal monologues.',
    genres: ['thriller', 'mystery', 'supernatural'],
    streaming_url: 'https://www.crunchyroll.com/series/death-note',
    subtitle_source: 'kitsunekko / OpenSubtitles',
    episodes: [
      {
        episode_number: 1,
        title: '新生',
        title_english: 'Rebirth',
        duration_seconds: 1380,
        subtitle_ja_url: '/subtitles/death-note/ep01-ja.srt',
        subtitle_en_url: '/subtitles/death-note/ep01-en.srt',
      },
      {
        episode_number: 2,
        title: '対決',
        title_english: 'Confrontation',
        duration_seconds: 1380,
        subtitle_ja_url: '/subtitles/death-note/ep02-ja.srt',
        subtitle_en_url: '/subtitles/death-note/ep02-en.srt',
      },
      {
        episode_number: 3,
        title: '取引',
        title_english: 'Dealings',
        duration_seconds: 1380,
        subtitle_ja_url: '/subtitles/death-note/ep03-ja.srt',
        subtitle_en_url: '/subtitles/death-note/ep03-en.srt',
      },
      {
        episode_number: 4,
        title: '追跡',
        title_english: 'Pursuit',
        duration_seconds: 1380,
        subtitle_ja_url: '/subtitles/death-note/ep04-ja.srt',
        subtitle_en_url: '/subtitles/death-note/ep04-en.srt',
      },
    ],
  },

  // ============================================================================
  // 5. 新世紀エヴァンゲリオン (Neon Genesis Evangelion) — Advanced / N3
  // ============================================================================
  {
    title: '新世紀エヴァンゲリオン',
    title_english: 'Neon Genesis Evangelion',
    type: 'anime',
    difficulty: 'advanced',
    jlpt_level: 'N3',
    description:
      'A mecha sci-fi drama with deep psychological themes. Dense technical and philosophical vocabulary. Military jargon, scientific terms, and emotionally complex dialogue make this a challenge for advanced learners.',
    genres: ['sci-fi', 'mecha', 'drama'],
    streaming_url: 'https://www.netflix.com/title/81033445',
    subtitle_source: 'community / evangelion archives',
    episodes: [
      {
        episode_number: 1,
        title: '使徒、襲来',
        title_english: 'Angel Attack',
        duration_seconds: 1440,
        subtitle_ja_url: '/subtitles/evangelion/ep01-ja.srt',
        subtitle_en_url: '/subtitles/evangelion/ep01-en.srt',
      },
      {
        episode_number: 2,
        title: '見知らぬ、天井',
        title_english: 'An Unfamiliar Ceiling',
        duration_seconds: 1440,
        subtitle_ja_url: '/subtitles/evangelion/ep02-ja.srt',
        subtitle_en_url: '/subtitles/evangelion/ep02-en.srt',
      },
      {
        episode_number: 3,
        title: '鳴らない、電話',
        title_english: "A Phone That Never Rings",
        duration_seconds: 1440,
        subtitle_ja_url: '/subtitles/evangelion/ep03-ja.srt',
        subtitle_en_url: '/subtitles/evangelion/ep03-en.srt',
      },
      {
        episode_number: 4,
        title: '雨、逃げ出した後',
        title_english: 'Rain, After Running Away',
        duration_seconds: 1440,
        subtitle_ja_url: '/subtitles/evangelion/ep04-ja.srt',
        subtitle_en_url: '/subtitles/evangelion/ep04-en.srt',
      },
    ],
  },
]
