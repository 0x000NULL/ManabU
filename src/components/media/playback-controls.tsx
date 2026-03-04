'use client'

import { formatTime } from '@/lib/utils/format-time'
import { SubtitleControls } from '@/components/media/subtitle-controls'

interface PlaybackControlsProps {
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playbackRate: number
  isFullscreen: boolean
  isLooping?: boolean
  hasJaSubtitles?: boolean
  hasEnSubtitles?: boolean
  onPlayPause: () => void
  onSeek: (time: number) => void
  onVolumeChange: (volume: number) => void
  onMuteToggle: () => void
  onPlaybackRateChange: () => void
  onFullscreenToggle: () => void
  onLoopToggle?: () => void
  onShowShortcuts?: () => void
}

export function PlaybackControls({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  playbackRate,
  isFullscreen,
  isLooping = false,
  hasJaSubtitles = false,
  hasEnSubtitles = false,
  onPlayPause,
  onSeek,
  onVolumeChange,
  onMuteToggle,
  onPlaybackRateChange,
  onFullscreenToggle,
  onLoopToggle,
  onShowShortcuts,
}: PlaybackControlsProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  function handleSeekBarClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    onSeek(fraction * duration)
  }

  function handleVolumeBarClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    onVolumeChange(fraction)
  }

  const rateLabel =
    playbackRate === 1 ? '1x' : `${playbackRate}x`

  return (
    <div className="flex items-center gap-3 px-4 py-2">
      {/* Play/Pause */}
      <button
        type="button"
        onClick={onPlayPause}
        className="shrink-0 text-white hover:text-white/80 transition-colors"
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Time display */}
      <span className="shrink-0 text-xs text-white/80 tabular-nums min-w-[80px]">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>

      {/* Seek bar */}
      <div
        className="group relative flex-1 h-1 bg-white/30 rounded-full cursor-pointer"
        onClick={handleSeekBarClick}
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        tabIndex={-1}
      >
        <div
          className="absolute inset-y-0 left-0 bg-primary rounded-full transition-[width] duration-100"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progress}% - 6px)` }}
        />
      </div>

      {/* Playback speed */}
      <button
        type="button"
        onClick={onPlaybackRateChange}
        className="shrink-0 text-xs font-medium text-white/80 hover:text-white transition-colors min-w-[32px] text-center"
        aria-label={`Playback speed ${rateLabel}`}
      >
        {rateLabel}
      </button>

      {/* Loop toggle */}
      {onLoopToggle && (
        <button
          type="button"
          onClick={onLoopToggle}
          className={`shrink-0 transition-colors ${
            isLooping ? 'text-amber-400 hover:text-amber-300' : 'text-white/80 hover:text-white'
          }`}
          aria-label={isLooping ? 'Disable loop' : 'Loop current subtitle'}
          title="Loop subtitle (L)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z" />
          </svg>
        </button>
      )}

      {/* Subtitle controls */}
      <SubtitleControls hasJaSubtitles={hasJaSubtitles} hasEnSubtitles={hasEnSubtitles} />

      {/* Volume */}
      <div className="group/vol flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onMuteToggle}
          className="text-white hover:text-white/80 transition-colors"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted || volume === 0 ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
            </svg>
          ) : volume < 0.5 ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>
        <div
          className="w-16 h-1 bg-white/30 rounded-full cursor-pointer opacity-0 group-hover/vol:opacity-100 transition-opacity"
          onClick={handleVolumeBarClick}
          role="slider"
          aria-label="Volume"
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={isMuted ? 0 : volume}
          tabIndex={-1}
        >
          <div
            className="h-full bg-white rounded-full"
            style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
          />
        </div>
      </div>

      {/* Keyboard shortcuts help */}
      {onShowShortcuts && (
        <button
          type="button"
          onClick={onShowShortcuts}
          className="shrink-0 text-white/80 hover:text-white transition-colors"
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts (?)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
          </svg>
        </button>
      )}

      {/* Fullscreen */}
      <button
        type="button"
        onClick={onFullscreenToggle}
        className="shrink-0 text-white hover:text-white/80 transition-colors"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
          </svg>
        )}
      </button>
    </div>
  )
}
