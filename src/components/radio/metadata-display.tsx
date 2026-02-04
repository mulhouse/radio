import { motion, AnimatePresence } from 'motion/react'
import type { TrackMetadata } from '@/lib/radio-metadata-api'
import { Music2, Disc3 } from 'lucide-react'

interface MetadataDisplayProps {
  metadata: TrackMetadata | null
  isLoading: boolean
  stationColor: string
}

export function MetadataDisplay({
  metadata,
  isLoading,
  stationColor,
}: MetadataDisplayProps) {
  if (isLoading && !metadata) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Disc3 className="h-4 w-4" />
        </motion.div>
        <span>Chargement des informations...</span>
      </div>
    )
  }

  if (!metadata || (!metadata.title && !metadata.show)) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-400">
        <Music2 className="h-4 w-4" />
        <span>En direct</span>
      </div>
    )
  }

  const hasValidTrack = metadata.title && metadata.title !== 'En direct'

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`${metadata.title}-${metadata.artist}-${metadata.show}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-1"
      >
        {/* Show name */}
        {metadata.show && (
          <div className="flex items-center gap-2">
            <div
              className="h-1 w-1 rounded-full"
              style={{ backgroundColor: stationColor }}
            />
            <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
              {metadata.show}
            </span>
          </div>
        )}

        {/* Track info */}
        {hasValidTrack && (
          <div className="flex items-start gap-3">
            {/* Cover art */}
            {metadata.coverArt && (
              <motion.img
                src={metadata.coverArt}
                alt="Cover"
                className="h-12 w-12 rounded-lg object-cover shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                onError={(e) => {
                  // Hide image if it fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            )}

            {/* Title and artist */}
            <div className="flex-1 min-w-0">
              {metadata.title && (
                <p
                  className="truncate font-semibold text-white"
                  style={{
                    textShadow: `0 0 10px ${stationColor}40`,
                  }}
                >
                  {metadata.title}
                </p>
              )}
              {metadata.artist && (
                <p className="truncate text-sm text-slate-300">
                  {metadata.artist}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Fallback if only show is available */}
        {!hasValidTrack && metadata.show && (
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Music2 className="h-4 w-4" />
            <span>En direct</span>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
