# Wakaru - Implementation Plan & Roadmap

## Development Philosophy

### Phased Approach
Build in stages, validating each phase before moving forward. Each phase delivers usable value while building toward the complete vision.

### Priority Framework
1. **Must Have (MVP)**: Core learning functionality, cannot launch without it
2. **Should Have (V1.0)**: Important features that significantly enhance learning
3. **Nice to Have (V2.0+)**: Valuable additions that can be added post-launch
4. **Future Consideration**: Ideas to explore later based on user feedback

---

## Phase 1: MVP (Minimum Viable Product)

**Goal**: Launch a functional platform that complete beginners can use to start learning Japanese effectively.

### Phase 1A: Foundation

#### Project Setup
- [x] Initialize Next.js 14+ project with TypeScript
- [x] Configure Tailwind CSS for styling
- [x] Set up ESLint and Prettier
- [x] Configure project folder structure (app, components, lib, types, store)
- [x] Set up Git repository and initial commit
- [x] Configure environment variables (.env.local)

#### Database Setup
- [x] Set up Docker Compose for local PostgreSQL
- [x] Install and configure Prisma ORM
- [x] Design complete database schema (all tables)
- [x] Create Prisma schema file with all models
- [x] Generate initial migration
- [x] Create database seed script with sample data
- [x] Test database connection and migrations

#### Authentication System
- [x] Design JWT authentication flow
- [x] Create users table schema
- [x] Implement user registration endpoint (`/api/v1/auth/register`)
- [x] Implement password hashing with bcrypt (cost factor 12)
- [x] Implement login endpoint (`/api/v1/auth/login`)
- [x] Implement JWT token generation and validation
- [x] Set up HTTP-only cookie management
- [x] Implement logout endpoint (`/api/v1/auth/logout`)
- [x] Create password reset request endpoint
- [x] Create password reset confirmation endpoint
- [x] Implement token refresh endpoint
- [x] Add rate limiting to auth endpoints (5 attempts/15 min)
- [x] Create authentication middleware for protected routes
- [x] Test complete auth flow end-to-end

#### Basic UI Components
- [x] Create root layout component
- [x] Design and implement Header component
- [x] Design and implement Sidebar/Navigation component
- [x] Create reusable Button component
- [x] Create reusable Input component
- [x] Create reusable Card component
- [x] Create Modal/Dialog component
- [x] Create Loading spinner component
- [x] Implement responsive layout (mobile, tablet, desktop)
- [x] Set up Zustand for state management
- [x] Create authStore with login/logout actions
- [x] Create registration page UI
- [x] Create login page UI
- [x] Create password reset page UI
- [x] Test responsive design on multiple devices

---

### Phase 1B: First Learning Module (Hiragana)

#### Hiragana Data & Content
- [x] Create kana table in database
- [x] Populate hiragana characters (46 base + 33 combinations)
- [x] Organize hiragana into 14 learning groups
- [x] Source/create stroke order SVG animations for each character
- [x] Record or source native audio for each character
- [x] Write mnemonic aids for each character
- [x] Find/create example words using each character
- [x] Create special rules content (long vowels, small tsu)

#### Hiragana Learning Interface
- [x] Create hiragana course overview page
- [x] Design character lesson card component
- [x] Implement stroke order animation display
- [x] Add audio playback for character pronunciation
- [x] Display mnemonic aids in lesson view
- [x] Show example words for each character
- [x] Create lesson navigation (previous/next character)
- [x] Implement group-based lesson progression

#### Hiragana Practice Modes
- [x] Create recognition quiz component (character → romaji)
- [x] Create typing test component (romaji → hiragana)
- [x] Implement character picker input method
- [x] Create audio quiz component (sound → character selection)
- [x] Create mixed review mode (random selection)
- [x] Add quiz result feedback UI
- [x] Implement quiz scoring and accuracy tracking

#### Hiragana Progress Tracking
- [x] Create user_progress table entries for hiragana
- [x] Implement character learned/mastered status tracking
- [x] Track accuracy per character
- [x] Calculate and display overall hiragana completion %
- [x] Implement SRS-lite scheduling for hiragana reviews
- [x] Create hiragana progress dashboard view
- [x] Show due reviews count for hiragana
- [x] Add achievement milestone (e.g., "All vowels learned!")

#### Testing & Validation
- [ ] Test complete hiragana learning flow
- [ ] Verify all 79 characters display correctly
- [ ] Test audio playback on all browsers
- [ ] Verify progress persists across sessions
- [ ] Test quiz functionality and scoring
- [ ] Ensure mobile-responsive hiragana lessons

---

### Phase 1C: Vocabulary System with SRS

#### Vocabulary Database
- [x] Create vocabulary table schema
- [x] Create example_sentences table schema
- [x] Create vocabulary_sentences junction table
- [x] Download and parse JMdict dictionary data
- [x] Download Leeds frequency lists
- [x] Import top 1000 words with meanings and readings
- [x] Source example sentences from Tatoeba for 3000 words (7,015 sentences, 92.9% coverage)
- [x] Filter and quality-check example sentences
- [x] Tag vocabulary with JLPT levels (N5-N3)
- [x] Tag vocabulary with frequency tiers
- [x] Add part of speech data
- [x] Source or generate audio files for vocabulary (Web Speech API TTS for MVP)
- [x] Expand vocabulary database to 3000 words
- [x] Create vocabulary seeding script

#### SRS Algorithm Implementation
- [x] Create `lib/utils/srs-algorithm.ts` file
- [x] Implement `calculateNextReview()` function (Modified SM-2)
- [x] Implement `getNextReviewDate()` function
- [x] Define SRSCard TypeScript interface
- [x] Define Rating type ('again' | 'hard' | 'good' | 'easy')
- [x] Test SRS algorithm with various scenarios
- [x] Implement ease factor calculation (min 1.3)
- [x] Implement interval progression logic
- [x] Set review time normalization (4 AM reset)

#### SRS API Endpoints
- [x] Create `/api/v1/srs/due` endpoint (get due reviews)
- [x] Create `/api/v1/srs/review` endpoint (submit review rating)
- [x] Create `/api/v1/srs/new` endpoint (get new items to learn)
- [x] Create `/api/v1/srs/learn` endpoint (mark item as started)
- [x] Implement user progress query optimization
- [x] Add indexes for next_review_at queries
- [ ] Test API endpoints with sample data
- [x] Add input validation with Zod schemas

#### Vocabulary API Endpoints
- [x] Create `/api/v1/vocabulary` endpoint (list with pagination)
- [x] Create `/api/v1/vocabulary/:id` endpoint (get single word)
- [x] Create `/api/v1/vocabulary/search` endpoint (search by word/meaning)
- [x] Add JLPT level filtering
- [x] Add frequency tier filtering
- [x] Implement pagination (limit/offset)
- [ ] Test vocabulary endpoints

#### Flashcard Review Interface
- [x] Create ReviewSession component
- [x] Create ReviewCard component (front/back flip)
- [x] Implement card reveal interaction
- [x] Create rating buttons (Again, Hard, Good, Easy)
- [x] Add keyboard shortcuts (1-4 for ratings, Space for reveal)
- [x] Display current word with reading and furigana
- [x] Show example sentences on card back
- [x] Implement progress bar (X cards remaining)
- [x] Create reviewStore in Zustand
- [x] Add review queue management in store
- [x] Fetch due reviews on session start
- [x] Submit review and update queue
- [x] Show completion message when reviews done
- [x] Display cards studied today count (learned today via /api/v1/srs/stats)

#### New Word Learning Flow
- [x] Create new word learning page
- [x] Display new words one at a time
- [x] Show word, reading, meaning, and examples
- [x] Add "Mark as Learning" button
- [x] Configure daily new word limit (default 20)
- [x] Add user setting for new word limit
- [x] Track new words learned today
- [x] Create smooth transition to review mode

#### Vocabulary Browsing
- [x] Create vocabulary browse page
- [x] Implement search functionality
- [x] Add JLPT level filter dropdown
- [x] Add frequency tier filter
- [x] Display vocabulary in card grid or list
- [x] Show word details in modal/drawer
- [x] Add "Add to SRS" button for manual addition
- [x] Implement pagination for large lists (standard pagination, no react-window needed)

#### Progress Tracking
- [x] Display total vocabulary learned count
- [x] Display vocabulary mastered count (interval > 30 days)
- [x] Show daily review completion count
- [x] Calculate and display retention rate
- [x] Track learning velocity (words/week)
- [x] Create vocabulary progress chart

#### Testing & Validation
- [ ] Test complete SRS review flow
- [ ] Verify SRS algorithm schedules correctly
- [ ] Test all 4 rating options update intervals properly
- [ ] Verify progress persists correctly
- [ ] Test new word learning flow
- [ ] Load test with 500+ vocabulary items
- [ ] Test vocabulary search and filtering

---

### Phase 1D: Expansion

#### Katakana Curriculum
- [x] Populate katakana characters in kana table (46 base + 33 combinations)
- [x] Source stroke order animations for katakana
- [x] Source/record audio for katakana
- [x] Create mnemonics for katakana characters
- [x] Create example words (foreign words, emphasis)
- [x] Add katakana course overview page
- [x] Reuse hiragana components for katakana lessons
- [x] Implement katakana-specific practice modes
- [x] Add katakana progress tracking
- [ ] Test complete katakana learning flow

#### Grammar System Foundation
- [ ] Create grammar_patterns table
- [ ] Create grammar_examples table
- [ ] Research and compile N5 grammar patterns (30 patterns)
- [ ] Write explanations for core N5 patterns
- [ ] Create 3-5 example sentences per pattern
- [ ] Add formation rules for each pattern
- [ ] Add common mistakes and notes sections
- [ ] Tag patterns with JLPT levels and difficulty
- [ ] Create grammar seed script

#### Grammar API Endpoints
- [ ] Create `/api/v1/grammar` endpoint (list patterns)
- [ ] Create `/api/v1/grammar/:id` endpoint (get single pattern)
- [ ] Add JLPT level filtering
- [ ] Add difficulty-based sorting
- [ ] Test grammar API endpoints

#### Grammar Lesson UI
- [ ] Create grammar patterns list page
- [ ] Create grammar pattern detail page
- [ ] Display pattern, meaning, and formation
- [ ] Show example sentences with translations
- [ ] Add notes and common mistakes section
- [ ] Implement pattern navigation (prev/next)
- [ ] Add progress tracking for grammar patterns
- [ ] Create grammar progress indicator on dashboard

#### Grammar Practice (Basic)
- [ ] Create fill-in-the-blank exercise component
- [ ] Create multiple choice exercise component
- [ ] Add 5-10 practice exercises per pattern
- [ ] Implement exercise feedback (correct/incorrect)
- [ ] Track grammar practice completion

#### Additional N4 Grammar
- [ ] Research and compile 20 core N4 patterns
- [ ] Write explanations for N4 patterns
- [ ] Create example sentences for N4 patterns
- [ ] Add N4 patterns to database

#### Testing & Validation
- [ ] Test katakana learning flow
- [ ] Test grammar lesson display
- [ ] Verify grammar examples display correctly
- [ ] Test grammar practice exercises
- [ ] Ensure grammar integrates with vocabulary (filter by pattern)

---

### Phase 1E: Immersion Tools

#### Media Content System
- [ ] Create media_content table
- [ ] Create media_episodes table
- [ ] Create user_media_progress table
- [ ] Curate initial 5 anime/drama titles
- [ ] Research legal streaming sources for curated titles
- [ ] Source Japanese subtitles (.srt/.ass files) for 5 titles
- [ ] Create English translations for subtitles (or source existing)
- [ ] Tag media with difficulty levels (beginner/intermediate/advanced)
- [ ] Add genre tags to media
- [ ] Create media library seed script

#### Media API Endpoints
- [ ] Create `/api/v1/media` endpoint (list media)
- [ ] Create `/api/v1/media/:id` endpoint (get media details)
- [ ] Create `/api/v1/media/:mediaId/episodes/:episodeId` endpoint
- [ ] Create `/api/v1/media/progress` endpoint (save progress)
- [ ] Add difficulty and type filtering
- [ ] Parse and serve subtitle data with episodes
- [ ] Test media API endpoints

#### Video Player Component
- [ ] Install and configure video.js or similar player
- [ ] Create VideoPlayer component
- [ ] Implement video playback controls
- [ ] Add play/pause (spacebar support)
- [ ] Add seek forward/backward (arrow keys)
- [ ] Add playback speed control (0.5x, 0.75x, 1x)
- [ ] Implement volume controls
- [ ] Add fullscreen support
- [ ] Test video player on multiple browsers

#### Subtitle System
- [ ] Create subtitle parser for .srt format
- [ ] Create subtitle parser for .ass format
- [ ] Implement subtitle timing sync with video
- [ ] Create SubtitleDisplay component
- [ ] Display Japanese subtitle with furigana (ruby text)
- [ ] Display English subtitle simultaneously
- [ ] Add toggle switches for Japanese/English subtitles
- [ ] Implement font size adjustment
- [ ] Style subtitle display (positioning, readability)
- [ ] Add subtitle background for readability

#### Interactive Subtitle Features
- [ ] Implement word tokenization for Japanese text
- [ ] Make subtitle words clickable
- [ ] Create DictionaryPopup component
- [ ] Integrate JMdict dictionary lookup
- [ ] Display word, reading, meaning, part of speech in popup
- [ ] Show example sentences in dictionary popup
- [ ] Add "Add to SRS" button in dictionary popup
- [ ] Implement add word to user's SRS deck
- [ ] Test dictionary lookup on various words

#### Playback Control Features
- [ ] Implement "Replay current subtitle" button (R key)
- [ ] Implement skip backward/forward by subtitle (arrow keys)
- [ ] Add "Loop current subtitle" toggle for shadowing
- [ ] Create keyboard shortcuts overlay/help
- [ ] Test all playback controls

#### Sentence Mining
- [ ] Create mined_sentences table
- [ ] Create "Mine this sentence" button on subtitles
- [ ] Implement screenshot capture at current timestamp
- [ ] Implement audio clip extraction for sentence
- [ ] Create `/api/v1/sentences/mine` endpoint (POST)
- [ ] Save sentence with Japanese, English, audio, screenshot, timestamp
- [ ] Create `/api/v1/sentences/mine` endpoint (GET - user's mined sentences)
- [ ] Create mined sentences browsing page
- [ ] Add mined sentences to SRS review rotation
- [ ] Implement delete mined sentence
- [ ] Implement edit mined sentence notes
- [ ] Test complete sentence mining flow

#### Media Library UI
- [ ] Create media library page
- [ ] Display media cards with cover images
- [ ] Add difficulty badges to media cards
- [ ] Implement media search and filtering
- [ ] Create media detail page (episodes list)
- [ ] Display user progress (episodes watched)
- [ ] Create episode selection interface
- [ ] Add "Resume watching" functionality
- [ ] Track watch time and completion status

#### Immersion Progress Tracking
- [ ] Track episodes watched per user
- [ ] Track total immersion time (hours)
- [ ] Track words mined count
- [ ] Track sentences mined count
- [ ] Display immersion stats on dashboard
- [ ] Create immersion progress chart

#### Testing & Validation
- [ ] Test video player on Chrome, Firefox, Safari
- [ ] Test subtitle sync accuracy
- [ ] Test dictionary lookup on 50+ words
- [ ] Test sentence mining complete flow
- [ ] Verify audio clips extract correctly
- [ ] Test add to SRS from player
- [ ] Test mobile video player functionality
- [ ] Load test with multiple concurrent streams

---

### Phase 1F: Polish & Launch Prep

#### User Dashboard
- [ ] Create main dashboard page layout
- [ ] Display daily overview section
- [ ] Show SRS reviews due today count
- [ ] Show new vocabulary available count
- [ ] Display current study streak
- [ ] Add quick-start buttons (Review, New Words, Grammar, Immersion)
- [ ] Create progress stats section
- [ ] Display hiragana/katakana completion %
- [ ] Display total vocabulary learned
- [ ] Display vocabulary mastered count
- [ ] Display grammar patterns learned
- [ ] Display total immersion time
- [ ] Display sentences mined count
- [ ] Create learning path section with suggested next steps
- [ ] Show milestone achievements (e.g., "100 words learned!")
- [ ] Implement milestone detection logic

#### User Settings
- [ ] Create settings page
- [ ] Add daily new word limit setting (5-50 range)
- [ ] Add review schedule preferences
- [ ] Add interface language toggle
- [ ] Add audio autoplay setting
- [ ] Add furigana display preference (always/hover/never)
- [ ] Add dark mode toggle (bonus)
- [ ] Implement settings save to user profile
- [ ] Test settings persistence

#### User Profile
- [ ] Create profile page
- [ ] Display user email and display name
- [ ] Add edit profile functionality
- [ ] Add change password functionality
- [ ] Display account creation date
- [ ] Show lifetime learning statistics

#### Mobile Optimization
- [ ] Test all pages on mobile devices (iOS Safari, Android Chrome)
- [ ] Optimize SRS review interface for touch (swipe gestures)
- [ ] Ensure touch targets are minimum 44x44px
- [ ] Test video player controls on mobile
- [ ] Optimize subtitle display for small screens
- [ ] Test dictionary popup on mobile
- [ ] Eliminate horizontal scrolling on all pages
- [ ] Test responsive navigation menu
- [ ] Optimize grammar lessons for mobile reading
- [ ] Test kana lessons on mobile

#### Performance Optimization
- [ ] Implement code splitting for routes
- [ ] Add lazy loading for heavy components (video player)
- [ ] Optimize images with Next.js Image component
- [ ] Implement virtual scrolling for vocabulary/kanji lists
- [ ] Add React.memo to ReviewCard and other expensive components
- [ ] Optimize database queries (add missing indexes)
- [ ] Set up database connection pooling (PgBouncer)
- [ ] Implement API response caching where appropriate
- [ ] Minimize bundle size (analyze with webpack-bundle-analyzer)
- [ ] Achieve <3s initial page load time
- [ ] Test performance on mid-range mobile devices

#### PWA Basics
- [ ] Install and configure next-pwa
- [ ] Create web app manifest
- [ ] Add app icons (various sizes)
- [ ] Configure service worker for offline support
- [ ] Test "Add to Home Screen" functionality
- [ ] Implement basic offline caching for static assets
- [ ] Test PWA on iOS and Android

#### Testing
- [ ] Write unit tests for SRS algorithm
- [ ] Write unit tests for auth endpoints
- [ ] Write integration tests for user registration flow
- [ ] Write integration tests for SRS review flow
- [ ] Write integration tests for vocabulary learning flow
- [ ] Set up Jest and React Testing Library
- [ ] Test cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Conduct accessibility audit (WCAG 2.1 AA)
- [ ] Fix accessibility issues found
- [ ] Test keyboard navigation throughout app
- [ ] Add screen reader support where needed

#### User Onboarding
- [ ] Create landing page (public-facing)
- [ ] Design onboarding flow for new users
- [ ] Create welcome screen after registration
- [ ] Add product tour of dashboard (optional)
- [ ] Create first lesson prompt (Hiragana vowels)
- [ ] Add daily study goal setting in onboarding
- [ ] Create help/documentation section
- [ ] Add tooltips for key features
- [ ] Create FAQ page

#### Documentation
- [ ] Write README.md with setup instructions
- [ ] Document API endpoints (Swagger/OpenAPI or manual)
- [ ] Create developer setup guide
- [ ] Document database schema
- [ ] Write contribution guidelines (if open-source)

#### Security Audit
- [ ] Review authentication security (JWT expiry, cookie settings)
- [ ] Ensure all passwords are hashed with bcrypt
- [ ] Verify CSRF protection is active
- [ ] Add rate limiting to all API endpoints
- [ ] Test for SQL injection vulnerabilities (should be prevented by Prisma)
- [ ] Test for XSS vulnerabilities
- [ ] Implement Content Security Policy headers
- [ ] Add Helmet.js for security headers
- [ ] Review environment variable security (.env not in git)

#### Deployment Setup
- [ ] Set up Vercel or Railway account
- [ ] Configure production environment
- [ ] Set up PostgreSQL managed database (Supabase/Railway/AWS RDS)
- [ ] Configure environment variables in production
- [ ] Set up file storage (S3/Cloudflare R2)
- [ ] Configure CDN (Cloudflare)
- [ ] Set up staging environment
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Configure automated testing in CI
- [ ] Set up automatic deployment to staging on `develop` branch
- [ ] Set up manual deployment to production from `main` branch
- [ ] Configure database migrations in deployment pipeline

#### Monitoring & Analytics
- [ ] Set up Sentry for error tracking
- [ ] Configure Sentry in production environment
- [ ] Set up basic analytics (privacy-respecting)
- [ ] Add performance monitoring
- [ ] Set up database query monitoring
- [ ] Create alert rules for critical errors
- [ ] Set up uptime monitoring

#### Pre-Launch Checklist
- [ ] All core features tested and working
- [ ] No critical bugs remaining
- [ ] Performance targets met (<3s load time, 95%+ uptime)
- [ ] Security audit passed
- [ ] Mobile experience polished
- [ ] Documentation complete
- [ ] Monitoring and alerts configured
- [ ] Backup strategy tested
- [ ] Beta testing with 5-10 users completed
- [ ] Incorporate beta feedback
- [ ] Final review of user flows
- [ ] Privacy policy written and published
- [ ] Terms of service written and published

#### MVP Launch
- [ ] Deploy to production
- [ ] Verify production deployment
- [ ] Test critical user flows in production
- [ ] Monitor error rates and performance
- [ ] Announce launch (if desired)
- [ ] Begin user acquisition
- [ ] Collect initial user feedback

---

## Phase 2: Version 1.0 (Full Launch)

**Goal**: Complete comprehensive platform with kanji learning, advanced grammar, expanded media, and JLPT prep.

### Kanji System

#### Kanji Database
- [ ] Create kanji table schema
- [ ] Create kanji_vocabulary junction table
- [ ] Source 2,136 Jōyō kanji data
- [ ] Import kanji characters with meanings
- [ ] Add on-yomi readings for each kanji
- [ ] Add kun-yomi readings for each kanji
- [ ] Add radical/component data (214 radicals)
- [ ] Add stroke count for each kanji
- [ ] Tag kanji with grade levels
- [ ] Tag kanji with JLPT levels
- [ ] Add frequency ranks to kanji
- [ ] Source/create stroke order SVG animations
- [ ] Write mnemonic stories for kanji
- [ ] Link kanji to vocabulary words (5-10 per kanji)
- [ ] Create kanji seed script

#### Kanji Learning Interface
- [ ] Create kanji course overview page
- [ ] Design kanji lesson card component
- [ ] Display kanji with stroke order animation
- [ ] Show meanings and readings (on-yomi/kun-yomi)
- [ ] Display radical breakdown
- [ ] Show mnemonic story
- [ ] List example vocabulary using kanji
- [ ] Implement learning order selection (frequency/JLPT/radical-based)
- [ ] Create kanji detail page

#### Kanji Practice
- [ ] Create kanji recognition quiz (see kanji → recall meaning)
- [ ] Create kanji production quiz (see meaning → select/write kanji)
- [ ] Create kanji reading quiz (see word → read pronunciation)
- [ ] Add kanji to SRS system
- [ ] Implement kanji progress tracking
- [ ] Create kanji progress dashboard

#### Kanji-Vocabulary Integration
- [ ] Highlight new kanji in vocabulary words
- [ ] Show kanji breakdown in word detail view
- [ ] Link from kanji to words using that kanji
- [ ] Add filter to show vocabulary by kanji

#### Kanji API
- [ ] Create `/api/v1/kanji` endpoint (list kanji)
- [ ] Create `/api/v1/kanji/:character` endpoint (get single kanji)
- [ ] Add JLPT level and frequency filtering
- [ ] Test kanji API endpoints

#### Testing
- [ ] Test kanji learning flow
- [ ] Verify stroke order animations work
- [ ] Test kanji SRS integration
- [ ] Test kanji-vocabulary linking

---

### Advanced Grammar

#### Grammar Content Expansion
- [ ] Research and compile remaining N4 patterns (~30 more)
- [ ] Research and compile N3 grammar patterns (~80 patterns)
- [ ] Research and compile selected N2 patterns (~40 patterns)
- [ ] Write detailed explanations for all patterns
- [ ] Create 5-10 example sentences per pattern
- [ ] Add comparison sections for similar patterns
- [ ] Add common mistakes sections
- [ ] Create practice exercises for each pattern
- [ ] Tag all patterns with JLPT level and difficulty

#### Enhanced Grammar UI
- [ ] Add grammar pattern comparison view
- [ ] Implement grammar search by pattern or meaning
- [ ] Add grammar organization by function (time/causation/contrast)
- [ ] Create grammar checklist by JLPT level
- [ ] Add progress tracking per JLPT level

#### Grammar Practice Enhancement
- [ ] Create fill-in-the-blank exercises with instant feedback
- [ ] Create sentence translation exercises
- [ ] Implement adaptive practice (focus on weak patterns)
- [ ] Add grammar pattern review to SRS (optional)

#### Testing
- [ ] Test all 200+ grammar patterns display correctly
- [ ] Verify examples are accurate
- [ ] Test practice exercises

---

### Expanded Media Library

#### Content Curation
- [ ] Curate 25 additional anime/drama titles (total 30)
- [ ] Source subtitles for all 30 titles
- [ ] Tag all media with accurate difficulty ratings
- [ ] Add genre tags to all media
- [ ] Calculate vocabulary coverage % per title
- [ ] Expand to 50+ titles
- [ ] Add Japanese drama content
- [ ] Add movie content
- [ ] Research YouTube channel integration

#### Media Metadata Enhancement
- [ ] Add community ratings system
- [ ] Add user reviews for media (optional)
- [ ] Calculate comprehensible input score (i+1)
- [ ] Add "recommended for you" based on vocabulary level

#### Recommendation Engine
- [ ] Implement basic recommendation algorithm
- [ ] Recommend media based on user's vocabulary coverage
- [ ] Suggest content at i+1 level (slightly challenging)
- [ ] Show similar titles based on genre

#### Testing
- [ ] Verify all 50 titles have working subtitles
- [ ] Test recommendation accuracy
- [ ] Test vocabulary coverage calculations

---

### JLPT Preparation

#### JLPT Vocabulary
- [ ] Source official JLPT N5 vocabulary list
- [ ] Source official JLPT N4 vocabulary list
- [ ] Source official JLPT N3 vocabulary list
- [ ] Integrate JLPT vocab into main vocabulary system
- [ ] Create JLPT vocabulary browsing by level
- [ ] Add JLPT progress tracking

#### JLPT Grammar Checklists
- [ ] Create grammar checklist for N5
- [ ] Create grammar checklist for N4
- [ ] Create grammar checklist for N3
- [ ] Track user's learned/mastered status per pattern
- [ ] Display JLPT readiness score

#### Practice Tests
- [ ] Create mock exam structure (vocabulary, grammar, reading, listening)
- [ ] Source/create N5 practice test questions
- [ ] Source/create N4 practice test questions
- [ ] Source/create N3 practice test questions
- [ ] Implement timed practice mode
- [ ] Create answer explanations for all questions
- [ ] Track practice test scores

#### Reading Comprehension
- [ ] Source/create reading passages for N5
- [ ] Source/create reading passages for N4
- [ ] Source/create reading passages for N3
- [ ] Create comprehension questions
- [ ] Add vocabulary/grammar breakdown for passages

#### Listening Practice
- [ ] Source/create listening audio clips for N5
- [ ] Source/create listening audio clips for N4
- [ ] Source/create listening audio clips for N3
- [ ] Create comprehension questions
- [ ] Provide transcripts (available after attempt)

#### JLPT Dashboard
- [ ] Create JLPT preparation dashboard
- [ ] Display readiness score per level
- [ ] Show vocabulary coverage %
- [ ] Show grammar coverage %
- [ ] Identify weak areas
- [ ] Suggest study plan for target JLPT level

#### Testing
- [ ] Test practice test functionality
- [ ] Verify question difficulty matches JLPT standards
- [ ] Test readiness score calculation

---

### PWA Offline Functionality

#### Service Worker Enhancement
- [ ] Configure advanced caching strategies
- [ ] Cache user's SRS deck for offline reviews
- [ ] Cache learned vocabulary for offline browsing
- [ ] Cache grammar lessons for offline reading
- [ ] Implement background sync for offline reviews

#### Offline Queue
- [ ] Create IndexedDB queue for offline review submissions
- [ ] Implement automatic sync when connection restored
- [ ] Add conflict resolution (server timestamp wins)
- [ ] Test offline review flow

#### Push Notifications
- [ ] Implement push notification system
- [ ] Add opt-in for review reminders
- [ ] Schedule daily review notifications
- [ ] Test notifications on iOS and Android

#### Testing
- [ ] Test offline SRS reviews
- [ ] Verify data syncs correctly when back online
- [ ] Test push notifications
- [ ] Ensure no data loss from offline usage

---

### Placement Test

#### Test Design
- [ ] Design hiragana/katakana recognition test
- [ ] Create vocabulary assessment (adaptive difficulty)
- [ ] Create grammar assessment questions
- [ ] Create kanji recognition test
- [ ] Create reading comprehension test (various levels)
- [ ] Implement adaptive test logic (stops when user consistently misses)

#### Test Implementation
- [ ] Create placement test UI
- [ ] Implement test scoring algorithm
- [ ] Estimate user level from test results
- [ ] Generate customized starting recommendations
- [ ] Allow user to override placement

#### Testing
- [ ] Test placement accuracy with various skill levels
- [ ] Verify recommendations are appropriate

---

### V1.0 Polish & Launch

#### Performance & Scaling
- [ ] Implement database read replicas (if needed)
- [ ] Add Redis caching for frequently accessed data
- [ ] Optimize slow database queries
- [ ] Load test with simulated 1000+ concurrent users
- [ ] Implement rate limiting site-wide
- [ ] Optimize bundle size further

#### Analytics & Feedback
- [ ] Implement user analytics dashboard (admin)
- [ ] Track feature adoption rates
- [ ] Add user feedback form
- [ ] Implement NPS survey
- [ ] Create user support ticket system

#### Final Testing
- [ ] Complete regression testing of all features
- [ ] Test all new V1.0 features
- [ ] Cross-browser testing
- [ ] Mobile testing on multiple devices
- [ ] Accessibility audit

#### V1.0 Launch
- [ ] Deploy V1.0 to production
- [ ] Monitor for issues
- [ ] Announce V1.0 launch
- [ ] Collect user feedback

---

## Phase 3: Version 2.0 & Beyond (Future)

### Reading Library
- [ ] Research graded reader sources
- [ ] Implement manga reader component
- [ ] Add news article integration
- [ ] Create reading progress tracking
- [ ] Integrate dictionary lookup in reader

### Writing Practice
- [ ] Design composition exercise system
- [ ] Create journaling feature
- [ ] Implement kanji writing practice (stroke order)
- [ ] Research handwriting recognition

### Speaking Practice
- [ ] Create shadowing exercise system
- [ ] Integrate speech recognition API
- [ ] Implement pitch accent visualization
- [ ] Add recording and playback feature

### Community Features
- [ ] Design community forum
- [ ] Implement shared decks system
- [ ] Create language exchange matching
- [ ] Add moderation tools

### Advanced Features
- [ ] Research AI tutor integration
- [ ] Implement ML-based learning path optimization
- [ ] Create advanced analytics
- [ ] Build Anki export functionality
- [ ] Design browser extension for web dictionary lookup
- [ ] Research native mobile app development

### Content Expansion
- [ ] Expand media library to 100+ titles
- [ ] Add podcast integration
- [ ] Integrate YouTube content
- [ ] Create news reader with graded articles
- [ ] Build literature library

---

## Open Questions to Resolve

- [ ] Decide on content licensing strategy for media
- [ ] Determine kanji vs vocabulary SRS integration approach
- [ ] Evaluate audio quality options (native speakers vs TTS)
- [ ] Decide timeline for native mobile apps vs PWA-only
- [ ] Decide if pitch accent should be included in MVP or later
- [ ] Determine if/when to add community features
- [ ] Finalize monetization model (free tier scope)

---

## Success Metrics Tracking

### Set Up Metrics Tracking
- [ ] Implement user retention tracking (3, 6, 12 month)
- [ ] Track progression milestones reached
- [ ] Track SRS daily completion rates
- [ ] Track immersion time per user
- [ ] Collect JLPT pass rate data (optional user reporting)
- [ ] Measure average page load time
- [ ] Monitor API error rates
- [ ] Track uptime percentage
- [ ] Implement NPS surveys

### Target Metrics (Validate Post-Launch)
- [ ] Achieve 50%+ retention at 3 months
- [ ] Achieve 30%+ retention at 6 months
- [ ] Users reaching 1000 words within 4-6 months
- [ ] 95%+ uptime
- [ ] <3s average page load time
- [ ] <5% API error rate
- [ ] NPS score >30
