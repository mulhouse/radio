import { motion } from 'motion/react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Loader2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react'
import { MetadataDisplay } from './metadata-display'
import type { RadioStation } from '@/lib/radio-stations'
import type { TrackMetadata } from '@/lib/radio-metadata-api'
import type { PlaybackState } from '@/hooks/use-audio-player'
import { Slider } from '@/components/ui/slider'

interface ControlBarProps {
  station: RadioStation | null
  playbackState: PlaybackState
  volume: number
  isMuted: boolean
  metadata: TrackMetadata | null
  metadataLoading: boolean
  error: string | null
  onPlayPause: () => void
  onVolumeChange: (volume: number) => void
  onToggleMute: () => void
  onRetry: () => void
}

export function ControlBar({
  station,
  playbackState,
  volume,
  isMuted,
  metadata,
  metadataLoading,
  error,
  onPlayPause,
  onVolumeChange,
  onToggleMute,
  onRetry,
}: ControlBarProps) {
  const isPlaying = playbackState === 'playing'
  const isLoading = playbackState === 'loading'
  const hasError = playbackState === 'error'

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-700/50 bg-gradient-to-t from-slate-950 via-slate-900 to-slate-900/95 backdrop-blur-xl"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
    >
      {/* Error banner */}
      {hasError && error && (
        <motion.div
          className="flex items-center justify-between gap-3 border-b border-red-500/20 bg-red-950/30 px-4 py-2 text-sm"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
          <button
            onClick={onRetry}
            className="flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/30"
          >
            <RotateCcw className="h-3 w-3" />
            Réessayer
          </button>
        </motion.div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center gap-6">
          {/* Station info and metadata */}
          <div className="flex-1 min-w-0">
            {station ? (
              <div className="flex items-center gap-4">
                {/* Station logo */}
                <div
                  className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white/5 p-2 backdrop-blur-sm"
                  style={{
                    boxShadow: isPlaying
                      ? `0 0 20px ${station.color}40`
                      : 'none',
                  }}
                >
                  <img
                    src={station.logoUrl}
                    alt={station.name}
                    className="h-full w-full object-contain"
                  />
                  {isPlaying && (
                    <motion.div
                      className="absolute inset-0 rounded-xl"
                      style={{ border: `2px solid ${station.color}` }}
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                </div>

                {/* Station name and metadata */}
                <div className="flex-1 min-w-0">
                  <h2
                    className="mb-1 font-display text-lg font-bold uppercase tracking-wide"
                    style={{
                      color: station.color,
                      textShadow: `0 0 15px ${station.color}60`,
                    }}
                  >
                    {station.name}
                  </h2>
                  <MetadataDisplay
                    metadata={metadata}
                    isLoading={metadataLoading}
                    stationColor={station.color}
                  />
                </div>
              </div>
            ) : (
              <div className="text-slate-400">
                <p className="font-display text-lg font-bold uppercase tracking-wide">
                  Sélectionnez une station
                </p>
                <p className="text-sm">Choisissez une radio pour commencer</p>
              </div>
            )}
          </div>

          {/* Playback controls */}
          <div className="flex items-center gap-4">
            {/* Play/Pause button */}
            <motion.button
              onClick={onPlayPause}
              disabled={!station || isLoading}
              className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-800 shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                boxShadow:
                  station && isPlaying
                    ? `0 0 30px ${station.color}60, 0 4px 20px rgba(0,0,0,0.4)`
                    : '0 4px 20px rgba(0,0,0,0.4)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : isPlaying ? (
                <Pause
                  className="h-6 w-6"
                  style={{ color: station?.color || '#ffffff' }}
                />
              ) : (
                <Play
                  className="h-6 w-6"
                  style={{ color: station?.color || '#ffffff' }}
                />
              )}

              {/* Pulsing ring for playing state */}
              {isPlaying && station && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${station.color}` }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.button>

            {/* Volume controls */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={onToggleMute}
                className="text-slate-400 transition-colors hover:text-white"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>

              <Slider
                value={[isMuted ? 0 : volume * 100]}
                onValueChange={(values) => onVolumeChange(values[0] / 100)}
                max={100}
                step={1}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      {station && isPlaying && (
        <div
          className="absolute bottom-0 left-0 right-0 h-1"
          style={{
            background: `linear-gradient(to right, transparent, ${station.color}, transparent)`,
            boxShadow: `0 0 20px ${station.color}80`,
          }}
        />
      )}
    </motion.div>
  )
}
