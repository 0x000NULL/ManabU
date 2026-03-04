'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils/cn'
import { PlaybackControls } from '@/components/media/playback-controls'
import { InteractiveSubtitleDisplay } from '@/components/media/interactive-subtitle-display'
import { DictionaryPopup } from '@/components/media/dictionary-popup'
import { KeyboardShortcutsOverlay } from '@/components/media/keyboard-shortcuts-overlay'
import { MineSentenceModal } from '@/components/media/mine-sentence-modal'
import { useSubtitleStore } from '@/store/subtitle-store'
import { useDictionaryStore } from '@/store/dictionary-store'
import { getCurrentCue, getPreviousCue, getNextCue } from '@/lib/utils/subtitle-navigation'
import { findActiveCue } from '@/lib/utils/subtitle-sync'
import { captureVideoScreenshot } from '@/lib/utils/screenshot-capture'
import type { SubtitleCue } from '@/lib/utils/subtitle-parser'

const PLAYBACK_RATES = [0.5, 0.75, 1] as const
const CONTROLS_HIDE_DELAY = 3000
const SEEK_STEP = 5
const VOLUME_STEP = 0.1

interface VideoPlayerProps {
  src: string | null
  poster?: string
  initialTime?: number
  subtitlesJa?: SubtitleCue[]
  subtitlesEn?: SubtitleCue[]
  mediaId?: string
  episodeNumber?: number
  onTimeUpdate?: (seconds: number) => void
  onEnded?: () => void
  className?: string
}

export function VideoPlayer({
  src,
  poster,
  initialTime = 0,
  subtitlesJa = [],
  subtitlesEn = [],
  mediaId,
  episodeNumber,
  onTimeUpdate,
  onEnded,
  className,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const initialTimeApplied = useRef(false)
  const loopCueRef = useRef<SubtitleCue | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState<number>(1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showShortcuts, setShowShortcuts] = useState(false)

  // Mining modal state
  const [mineModalOpen, setMineModalOpen] = useState(false)
  const [mineData, setMineData] = useState<{
    japanese: string
    english: string | null
    screenshotUrl: string | null
    timestamp: number
  } | null>(null)

  const isLooping = useSubtitleStore((s) => s.isLooping)

  // -- Helpers --

  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) {
        setShowControls(false)
      }
    }, CONTROLS_HIDE_DELAY)
  }, [])

  // -- Playback handlers --

  const togglePlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.play()
    } else {
      video.pause()
    }
  }, [])

  const pauseVideo = useCallback(() => {
    const video = videoRef.current
    if (!video || video.paused) return
    video.pause()
  }, [])

  const seek = useCallback((time: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = Math.max(0, Math.min(time, video.duration || 0))
  }, [])

  const changeVolume = useCallback((v: number) => {
    const video = videoRef.current
    if (!video) return
    const clamped = Math.max(0, Math.min(1, v))
    video.volume = clamped
    setVolume(clamped)
    if (clamped > 0 && video.muted) {
      video.muted = false
      setIsMuted(false)
    }
  }, [])

  const toggleMute = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setIsMuted(video.muted)
  }, [])

  const cyclePlaybackRate = useCallback(() => {
    const video = videoRef.current
    if (!video) return
    const currentIndex = PLAYBACK_RATES.indexOf(playbackRate as (typeof PLAYBACK_RATES)[number])
    const nextIndex = (currentIndex + 1) % PLAYBACK_RATES.length
    const nextRate = PLAYBACK_RATES[nextIndex]
    video.playbackRate = nextRate
    setPlaybackRate(nextRate)
  }, [playbackRate])

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      container.requestFullscreen()
    }
  }, [])

  // -- Subtitle navigation handlers --

  const replayCurrentSubtitle = useCallback(() => {
    const time = videoRef.current?.currentTime ?? 0
    const cue = getCurrentCue(subtitlesJa, time) ?? getPreviousCue(subtitlesJa, time)
    if (cue) seek(cue.startSeconds)
  }, [subtitlesJa, seek])

  const skipToPreviousSubtitle = useCallback(() => {
    const time = videoRef.current?.currentTime ?? 0
    const cue = getPreviousCue(subtitlesJa, time)
    if (cue) seek(cue.startSeconds)
  }, [subtitlesJa, seek])

  const skipToNextSubtitle = useCallback(() => {
    const time = videoRef.current?.currentTime ?? 0
    const cue = getNextCue(subtitlesJa, time)
    if (cue) seek(cue.startSeconds)
  }, [subtitlesJa, seek])

  const handleToggleLoop = useCallback(() => {
    const subtitleStore = useSubtitleStore.getState()
    subtitleStore.toggleLoop()

    if (!subtitleStore.isLooping) {
      // Was off, now turning on — capture current cue
      const time = videoRef.current?.currentTime ?? 0
      loopCueRef.current = getCurrentCue(subtitlesJa, time)
    } else {
      // Was on, now turning off
      loopCueRef.current = null
    }
  }, [subtitlesJa])

  // -- Mining handler --

  const handleMine = useCallback(
    (ja: SubtitleCue, en: SubtitleCue | null) => {
      pauseVideo()
      const screenshot = videoRef.current ? captureVideoScreenshot(videoRef.current) : null
      setMineData({
        japanese: ja.text,
        english: en?.text ?? null,
        screenshotUrl: screenshot,
        timestamp: videoRef.current?.currentTime ?? 0,
      })
      setMineModalOpen(true)
    },
    [pauseVideo],
  )

  const triggerMineFromKeyboard = useCallback(() => {
    const time = videoRef.current?.currentTime ?? 0
    const jaCue = getCurrentCue(subtitlesJa, time)
    if (!jaCue) return

    const enCue = findActiveCue(subtitlesEn, time)
    handleMine(jaCue, enCue)
  }, [subtitlesJa, subtitlesEn, handleMine])

  // -- Video event listeners --

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    function handlePlay() {
      setIsPlaying(true)
      resetHideTimer()
    }
    function handlePause() {
      setIsPlaying(false)
      setShowControls(true)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
    function handleTimeUpdate() {
      const t = video!.currentTime
      setCurrentTime(t)
      onTimeUpdate?.(t)

      // Loop enforcement
      if (useSubtitleStore.getState().isLooping && loopCueRef.current) {
        if (t >= loopCueRef.current.endSeconds) {
          video!.currentTime = loopCueRef.current.startSeconds
        }
      }
    }
    function handleLoadedMetadata() {
      setDuration(video!.duration)
      if (!initialTimeApplied.current && initialTime > 0) {
        video!.currentTime = initialTime
        initialTimeApplied.current = true
      }
    }
    function handleEnded() {
      setIsPlaying(false)
      setShowControls(true)
      onEnded?.()
    }
    function handleVolumeChange() {
      setVolume(video!.volume)
      setIsMuted(video!.muted)
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('volumechange', handleVolumeChange)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('volumechange', handleVolumeChange)
    }
  }, [initialTime, onTimeUpdate, onEnded, resetHideTimer])

  // -- Fullscreen change listener --

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // -- Keyboard shortcuts --

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if focus is on an input-like element inside the container
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      switch (e.key) {
        case ' ':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowLeft':
          e.preventDefault()
          seek((videoRef.current?.currentTime ?? 0) - SEEK_STEP)
          break
        case 'ArrowRight':
          e.preventDefault()
          seek((videoRef.current?.currentTime ?? 0) + SEEK_STEP)
          break
        case 'ArrowUp':
          e.preventDefault()
          changeVolume((videoRef.current?.volume ?? 1) + VOLUME_STEP)
          break
        case 'ArrowDown':
          e.preventDefault()
          changeVolume((videoRef.current?.volume ?? 1) - VOLUME_STEP)
          break
        case 'm':
        case 'M':
          e.preventDefault()
          toggleMute()
          break
        case 'f':
        case 'F':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'j':
        case 'J':
          e.preventDefault()
          useSubtitleStore.getState().toggleJapanese()
          break
        case 'e':
        case 'E':
          e.preventDefault()
          useSubtitleStore.getState().toggleEnglish()
          break
        case 'r':
        case 'R':
          e.preventDefault()
          replayCurrentSubtitle()
          break
        case 'a':
        case 'A':
          e.preventDefault()
          skipToPreviousSubtitle()
          break
        case 'd':
        case 'D':
          e.preventDefault()
          skipToNextSubtitle()
          break
        case 'l':
        case 'L':
          e.preventDefault()
          handleToggleLoop()
          break
        case 's':
        case 'S':
          e.preventDefault()
          triggerMineFromKeyboard()
          break
        case '?':
          e.preventDefault()
          setShowShortcuts(true)
          break
      }

      resetHideTimer()
    }

    container.addEventListener('keydown', handleKeyDown)
    return () => container.removeEventListener('keydown', handleKeyDown)
  }, [
    togglePlay,
    seek,
    changeVolume,
    toggleMute,
    toggleFullscreen,
    resetHideTimer,
    replayCurrentSubtitle,
    skipToPreviousSubtitle,
    skipToNextSubtitle,
    handleToggleLoop,
    triggerMineFromKeyboard,
  ])

  // -- Cleanup hide timer on unmount --

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [])

  // -- Close dictionary popup on unmount --

  useEffect(() => {
    return () => {
      useDictionaryStore.getState().closePopup()
    }
  }, [])

  // -- Null src placeholder --

  if (!src) {
    return (
      <div
        className={cn(
          'relative flex items-center justify-center bg-black rounded-lg aspect-video',
          className,
        )}
      >
        <div className="text-center text-white/60">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mx-auto mb-3 opacity-40"
          >
            <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zM10 8v8l6-4z" />
          </svg>
          <p className="text-sm">Video source not available</p>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative bg-black rounded-lg overflow-hidden group focus:outline-none',
        className,
      )}
      tabIndex={0}
      onMouseMove={resetHideTimer}
      onMouseLeave={() => {
        if (isPlaying) setShowControls(false)
      }}
    >
      {/* Video element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full aspect-video cursor-pointer"
        onClick={togglePlay}
        playsInline
        preload="metadata"
      />

      {/* Large play button overlay when paused */}
      {!isPlaying && (
        <button
          type="button"
          className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity"
          onClick={togglePlay}
          aria-label="Play"
        >
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </button>
      )}

      {/* Loop indicator badge */}
      {isLooping && (
        <div className="absolute top-3 right-3 rounded bg-amber-500/80 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
          Loop
        </div>
      )}

      {/* Interactive subtitle overlay */}
      <InteractiveSubtitleDisplay
        subtitlesJa={subtitlesJa}
        subtitlesEn={subtitlesEn}
        currentTime={currentTime}
        onPauseRequest={pauseVideo}
        onMineRequest={handleMine}
      />

      {/* Dictionary popup */}
      <DictionaryPopup containerRef={containerRef} />

      {/* Controls bar */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      >
        <PlaybackControls
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          playbackRate={playbackRate}
          isFullscreen={isFullscreen}
          isLooping={isLooping}
          hasJaSubtitles={subtitlesJa.length > 0}
          hasEnSubtitles={subtitlesEn.length > 0}
          onPlayPause={togglePlay}
          onSeek={seek}
          onVolumeChange={changeVolume}
          onMuteToggle={toggleMute}
          onPlaybackRateChange={cyclePlaybackRate}
          onFullscreenToggle={toggleFullscreen}
          onLoopToggle={handleToggleLoop}
          onShowShortcuts={() => setShowShortcuts(true)}
        />
      </div>

      {/* Keyboard shortcuts overlay */}
      <KeyboardShortcutsOverlay open={showShortcuts} onClose={() => setShowShortcuts(false)} />

      {/* Mine sentence modal */}
      {mineData && (
        <MineSentenceModal
          open={mineModalOpen}
          onClose={() => {
            setMineModalOpen(false)
            setMineData(null)
          }}
          japanese={mineData.japanese}
          english={mineData.english}
          screenshotUrl={mineData.screenshotUrl}
          videoUrl={src}
          mediaId={mediaId}
          episodeNumber={episodeNumber}
          timestamp={mineData.timestamp}
        />
      )}
    </div>
  )
}
