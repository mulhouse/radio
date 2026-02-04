import { useState, useEffect, useRef, useCallback } from 'react'
import type { RadioStation } from '@/lib/radio-stations'

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

export interface AudioPlayerState {
  currentStation: RadioStation | null
  playbackState: PlaybackState
  volume: number
  isMuted: boolean
  error: string | null
}

export interface AudioPlayerActions {
  play: (station: RadioStation) => Promise<void>
  pause: () => void
  resume: () => void
  stop: () => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  retry: () => Promise<void>
}

export function useAudioPlayer(): AudioPlayerState & AudioPlayerActions {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [currentStation, setCurrentStation] = useState<RadioStation | null>(
    null,
  )
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle')
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem('radio-volume')
    return saved ? parseFloat(saved) : 0.7
  })
  const [isMuted, setIsMuted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'none'
    audio.volume = volume
    audioRef.current = audio

    // Set up media session for background playback
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {
        void audio.play()
      })
      navigator.mediaSession.setActionHandler('pause', () => {
        audio.pause()
      })
      navigator.mediaSession.setActionHandler('stop', () => {
        audio.pause()
        audio.currentTime = 0
      })
    }

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Set up audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleCanPlay = () => {
      setPlaybackState('playing')
      setError(null)
    }

    const handlePlaying = () => {
      setPlaybackState('playing')
      setError(null)
    }

    const handlePause = () => {
      if (playbackState !== 'loading') {
        setPlaybackState('paused')
      }
    }

    const handleWaiting = () => {
      setPlaybackState('loading')
    }

    const handleError = (e: Event) => {
      console.error('Audio error:', e)
      const audioError = (e.target as HTMLAudioElement).error

      let errorMessage = 'Erreur de lecture'
      if (audioError) {
        switch (audioError.code) {
          case MediaError.MEDIA_ERR_ABORTED:
            errorMessage = 'Lecture interrompue'
            break
          case MediaError.MEDIA_ERR_NETWORK:
            errorMessage = 'Erreur réseau - Vérifiez votre connexion'
            break
          case MediaError.MEDIA_ERR_DECODE:
            errorMessage = 'Erreur de décodage du flux'
            break
          case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Format de flux non supporté'
            break
        }
      }

      setPlaybackState('error')
      setError(errorMessage)
    }

    const handleStalled = () => {
      setError('Connexion lente - Mise en mémoire tampon...')
    }

    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('error', handleError)
    audio.addEventListener('stalled', handleStalled)

    return () => {
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('playing', handlePlaying)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('stalled', handleStalled)
    }
  }, [playbackState])

  const play = useCallback(async (station: RadioStation) => {
    const audio = audioRef.current
    if (!audio) return

    try {
      setPlaybackState('loading')
      setError(null)
      setCurrentStation(station)

      // Stop current playback
      audio.pause()
      audio.src = ''

      // Load new stream
      audio.src = station.streamUrl
      audio.load()

      // Update media session metadata
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: station.name,
          artist: 'Radio en direct',
          artwork: [
            {
              src: station.logoUrl,
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        })
      }

      // Start playback
      await audio.play()

      // Save last played station
      localStorage.setItem('last-station', station.id)
    } catch (err) {
      console.error('Play error:', err)
      setPlaybackState('error')
      setError('Impossible de lire cette station - Vérifiez votre connexion')
    }
  }, [])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (audio && playbackState === 'playing') {
      audio.pause()
      setPlaybackState('paused')
    }
  }, [playbackState])

  const resume = useCallback(async () => {
    const audio = audioRef.current
    if (audio && playbackState === 'paused') {
      try {
        await audio.play()
        setPlaybackState('playing')
      } catch (err) {
        console.error('Resume error:', err)
        setPlaybackState('error')
        setError('Impossible de reprendre la lecture')
      }
    }
  }, [playbackState])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.src = ''
      setPlaybackState('idle')
      setCurrentStation(null)
      setError(null)
    }
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume))
    setVolumeState(clampedVolume)
    localStorage.setItem('radio-volume', clampedVolume.toString())
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev)
  }, [])

  const retry = useCallback(async () => {
    if (currentStation) {
      await play(currentStation)
    }
  }, [currentStation, play])

  return {
    currentStation,
    playbackState,
    volume,
    isMuted,
    error,
    play,
    pause,
    resume,
    stop,
    setVolume,
    toggleMute,
    retry,
  }
}
