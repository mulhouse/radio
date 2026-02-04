import { useState, useEffect } from 'react'
import type { RadioStation } from '@/lib/radio-stations'
import {
  createMetadataPoller,
  type TrackMetadata,
} from '@/lib/radio-metadata-api'
import { addToHistory } from '@/lib/listening-history'

export function useRadioMetadata(
  station: RadioStation | null,
  isPlaying: boolean,
) {
  const [metadata, setMetadata] = useState<TrackMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!station || !isPlaying) {
      setMetadata(null)
      return
    }

    setIsLoading(true)

    // Start polling for metadata
    const cleanup = createMetadataPoller(
      station.id,
      (newMetadata) => {
        setMetadata(newMetadata)
        setIsLoading(false)

        // Add to listening history if we have valid metadata
        if (
          newMetadata &&
          newMetadata.title &&
          newMetadata.title !== 'En direct'
        ) {
          addToHistory(station.id, station.name, station.color, newMetadata)
        }

        // Update media session if available
        if (newMetadata && 'mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: newMetadata.title || station.name,
            artist: newMetadata.artist || newMetadata.show || 'En direct',
            album: station.name,
            artwork: newMetadata.coverArt
              ? [
                  {
                    src: newMetadata.coverArt,
                    sizes: '512x512',
                    type: 'image/jpeg',
                  },
                ]
              : [
                  {
                    src: station.logoUrl,
                    sizes: '512x512',
                    type: 'image/png',
                  },
                ],
          })
        }
      },
      15000, // Poll every 15 seconds
    )

    return cleanup
  }, [station, isPlaying])

  return { metadata, isLoading }
}
