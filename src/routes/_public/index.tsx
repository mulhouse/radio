import { createFileRoute } from '@tanstack/react-router'
import { StationGrid } from '@/components/radio/station-grid'
import { ControlBar } from '@/components/radio/control-bar'
import { ListeningHistory } from '@/components/radio/listening-history'
import { useAudioPlayer } from '@/hooks/use-audio-player'
import { useRadioMetadata } from '@/hooks/use-radio-metadata'
import { registerServiceWorker } from '@/lib/register-sw'
import { getListeningHistory, clearHistory } from '@/lib/listening-history'
import type { RadioStation } from '@/lib/radio-stations'
import { motion } from 'motion/react'
import { Radio } from 'lucide-react'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_public/')({
  component: RadioApp,
})

function RadioApp() {
  // Register service worker for PWA functionality
  useEffect(() => {
    registerServiceWorker()
  }, [])

  const [history, setHistory] = useState(() => getListeningHistory())

  const {
    currentStation,
    playbackState,
    volume,
    isMuted,
    error,
    play,
    pause,
    resume,
    setVolume,
    toggleMute,
    retry,
  } = useAudioPlayer()

  const { metadata, isLoading: metadataLoading } = useRadioMetadata(
    currentStation,
    playbackState === 'playing',
  )

  // Update history when metadata changes
  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(getListeningHistory())
    }, 5000) // Check for updates every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const handleStationSelect = async (station: RadioStation) => {
    if (currentStation?.id === station.id) {
      // Toggle play/pause for same station
      if (playbackState === 'playing') {
        pause()
      } else if (playbackState === 'paused') {
        resume()
      } else {
        await play(station)
      }
    } else {
      // Play new station
      await play(station)
    }
  }

  const handlePlayPause = () => {
    if (!currentStation) return

    if (playbackState === 'playing') {
      pause()
    } else if (playbackState === 'paused') {
      resume()
    } else {
      void play(currentStation)
    }
  }

  const handleClearHistory = () => {
    clearHistory()
    setHistory([])
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated background pattern */}
      <div className="fixed inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 opacity-[0.015] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <motion.header
        className="relative z-10 border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center gap-3">
            <motion.div
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(236, 72, 153, 0.3)',
                  '0 0 40px rgba(168, 85, 247, 0.4)',
                  '0 0 20px rgba(236, 72, 153, 0.3)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Radio className="h-6 w-6 text-white" />
            </motion.div>
            <div>
              <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-white">
                Web Radio
              </h1>
              <p className="text-sm text-slate-400">
                Vos stations préférées en un clic
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main content */}
      <main className="relative z-10 pb-32 pt-8">
        <div className="mx-auto max-w-7xl space-y-8 px-4">
          <StationGrid
            currentStation={currentStation}
            isPlaying={playbackState === 'playing'}
            onStationSelect={handleStationSelect}
          />

          {/* Listening History */}
          <ListeningHistory history={history} onClear={handleClearHistory} />
        </div>
      </main>

      {/* Control bar */}
      <ControlBar
        station={currentStation}
        playbackState={playbackState}
        volume={volume}
        isMuted={isMuted}
        metadata={metadata}
        metadataLoading={metadataLoading}
        error={error}
        onPlayPause={handlePlayPause}
        onVolumeChange={setVolume}
        onToggleMute={toggleMute}
        onRetry={retry}
      />
    </div>
  )
}
