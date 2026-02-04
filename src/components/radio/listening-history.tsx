import { motion, AnimatePresence } from 'motion/react'
import { Clock, Trash2, Music2 } from 'lucide-react'
import type { HistoryEntry } from '@/lib/listening-history'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ListeningHistoryProps {
  history: HistoryEntry[]
  onClear: () => void
}

export function ListeningHistory({ history, onClear }: ListeningHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800/50 bg-slate-900/30 p-8 text-center backdrop-blur-sm">
        <Music2 className="mx-auto mb-3 h-12 w-12 text-slate-600" />
        <p className="text-slate-400">Aucun historique d'écoute</p>
        <p className="mt-1 text-sm text-slate-500">
          Les titres que vous écoutez apparaîtront ici
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-800/50 bg-slate-900/30 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/50 p-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-slate-400" />
          <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">
            Historique d'écoute
          </h3>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-medium text-slate-300">
            {history.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
        >
          <Trash2 className="h-3 w-3" />
          Effacer
        </button>
      </div>

      {/* History list */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {history.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="border-b border-slate-800/30 p-4 transition-colors hover:bg-slate-800/20"
            >
              <div className="flex items-start gap-3">
                {/* Cover art or placeholder */}
                {entry.metadata.coverArt ? (
                  <img
                    src={entry.metadata.coverArt}
                    alt="Cover"
                    className="h-12 w-12 flex-shrink-0 rounded-lg object-cover shadow-md"
                  />
                ) : (
                  <div
                    className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${entry.stationColor}20` }}
                  >
                    <Music2
                      className="h-6 w-6"
                      style={{ color: entry.stationColor }}
                    />
                  </div>
                )}

                {/* Track info */}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-white">
                    {entry.metadata.title}
                  </p>
                  {entry.metadata.artist && (
                    <p className="truncate text-sm text-slate-300">
                      {entry.metadata.artist}
                    </p>
                  )}
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span
                      className="font-medium"
                      style={{ color: entry.stationColor }}
                    >
                      {entry.stationName}
                    </span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(entry.timestamp, {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
