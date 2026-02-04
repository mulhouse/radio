import { motion } from 'motion/react'
import type { RadioStation } from '@/lib/radio-stations'
import { Radio } from 'lucide-react'
import { useState } from 'react'

interface StationButtonProps {
  station: RadioStation
  isActive: boolean
  isPlaying: boolean
  onClick: () => void
}

export function StationButton({
  station,
  isActive,
  isPlaying,
  onClick,
}: StationButtonProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <motion.button
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-6 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
      style={{
        boxShadow: isActive
          ? `0 0 30px ${station.color}40, 0 0 60px ${station.color}20`
          : '0 4px 20px rgba(0,0,0,0.3)',
        border: isActive
          ? `2px solid ${station.color}`
          : '2px solid transparent',
      }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Animated background gradient */}
      {isActive && (
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at center, ${station.color}, transparent)`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Station logo */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        <div
          className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl bg-white/10 p-3 backdrop-blur-sm"
          style={{
            backgroundColor: isActive ? `${station.color}20` : undefined,
          }}
        >
          {/* Pulsing ring for active playing station */}
          {isActive && isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-xl"
              style={{
                border: `2px solid ${station.color}`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          {!imageError ? (
            <img
              src={station.logoUrl}
              alt={station.name}
              className="h-full w-full object-contain"
              crossOrigin="anonymous"
              onError={() => {
                console.warn(`Failed to load logo for ${station.name}`)
                setImageError(true)
              }}
            />
          ) : (
            <Radio className="h-12 w-12 text-white" />
          )}
        </div>

        {/* Station name */}
        <div className="text-center">
          <h3
            className="font-display text-xl font-bold uppercase tracking-wider"
            style={{
              color: isActive ? station.color : '#ffffff',
              textShadow: isActive ? `0 0 20px ${station.color}80` : 'none',
            }}
          >
            {station.name}
          </h3>

          {/* Playing indicator */}
          {isActive && isPlaying && (
            <motion.div
              className="mt-2 flex items-center justify-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Radio className="h-3 w-3" style={{ color: station.color }} />
              <span
                className="text-xs font-medium uppercase tracking-wide"
                style={{ color: station.color }}
              >
                En direct
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Corner accent */}
      {isActive && (
        <motion.div
          className="absolute right-0 top-0 h-16 w-16"
          style={{
            background: `radial-gradient(circle at top right, ${station.color}40, transparent)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.button>
  )
}
