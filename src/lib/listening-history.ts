import type { TrackMetadata } from './radio-metadata-api'

export interface HistoryEntry {
  id: string
  stationId: string
  stationName: string
  stationColor: string
  metadata: TrackMetadata
  timestamp: number
}

const HISTORY_KEY = 'radio-listening-history'
const MAX_HISTORY_ITEMS = 10

/**
 * Get listening history from localStorage
 */
export function getListeningHistory(): HistoryEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY)
    if (!stored) return []
    return JSON.parse(stored) as HistoryEntry[]
  } catch (error) {
    console.error('Failed to load listening history:', error)
    return []
  }
}

/**
 * Add a track to listening history
 */
export function addToHistory(
  stationId: string,
  stationName: string,
  stationColor: string,
  metadata: TrackMetadata,
): void {
  // Don't add if there's no meaningful metadata
  if (!metadata.title || metadata.title === 'En direct') {
    return
  }

  const history = getListeningHistory()

  // Create new entry
  const newEntry: HistoryEntry = {
    id: `${stationId}-${Date.now()}`,
    stationId,
    stationName,
    stationColor,
    metadata,
    timestamp: Date.now(),
  }

  // Check if the last entry is the same track (avoid duplicates)
  const lastEntry = history[0]
  if (
    lastEntry &&
    lastEntry.stationId === stationId &&
    lastEntry.metadata.title === metadata.title &&
    lastEntry.metadata.artist === metadata.artist
  ) {
    return
  }

  // Add to beginning and limit to MAX_HISTORY_ITEMS
  const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY_ITEMS)

  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
  } catch (error) {
    console.error('Failed to save listening history:', error)
  }
}

/**
 * Clear listening history
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY)
  } catch (error) {
    console.error('Failed to clear listening history:', error)
  }
}
