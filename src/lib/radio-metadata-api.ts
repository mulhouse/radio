export interface TrackMetadata {
  title?: string
  artist?: string
  show?: string
  album?: string
  coverArt?: string
  startTime?: string
}

/**
 * Fetch metadata for Radio France stations (France Inter, France Musique, France Culture, FIP, etc.)
 */
async function fetchRadioFranceMetadata(
  stationId: string,
): Promise<TrackMetadata | null> {
  try {
    const response = await fetch(
      `https://www.radiofrance.fr/api/v2.1/stations/${stationId}/live`,
      {
        mode: 'cors',
        headers: {
          Accept: 'application/json',
        },
      },
    )
    if (!response.ok) {
      console.warn(
        `Radio France API returned ${response.status} for ${stationId}`,
      )
      return null
    }

    const data = await response.json()
    const now = data?.now

    if (!now) {
      return {
        title: 'En direct',
        artist: '',
        show: '',
      }
    }

    return {
      title:
        now?.secondLine || now?.song?.title || now?.firstLine || 'En direct',
      artist: now?.firstLine || now?.song?.interpreters?.[0] || '',
      show: now?.show?.title || '',
      coverArt: now?.song?.cover || now?.show?.visual || undefined,
      startTime: now?.startTime,
    }
  } catch (error) {
    console.error('Radio France metadata error:', error)
    return {
      title: 'En direct',
      artist: '',
      show: '',
    }
  }
}

/**
 * Main metadata fetcher - routes to appropriate API based on station
 */
export async function fetchStationMetadata(
  stationId: string,
): Promise<TrackMetadata | null> {
  // Radio France stations - use their official API
  const radioFranceStations: Record<string, string> = {
    'france-inter': 'franceinter',
    'france-musique': 'francemusique',
    'france-culture': 'franceculture',
    fip: 'fip',
    'ici-besancon': 'fbbesancon',
  }

  if (radioFranceStations[stationId]) {
    return fetchRadioFranceMetadata(radioFranceStations[stationId])
  }

  // For other stations, return basic info
  return {
    title: 'En direct',
    artist: '',
    show: '',
  }
}

/**
 * Poll metadata at regular intervals
 */
export function createMetadataPoller(
  stationId: string,
  onUpdate: (metadata: TrackMetadata | null) => void,
  intervalMs: number = 15000,
): () => void {
  let intervalId: NodeJS.Timeout | null = null

  const poll = async () => {
    const metadata = await fetchStationMetadata(stationId)
    onUpdate(metadata)
  }

  // Initial fetch
  void poll()

  // Set up polling
  intervalId = setInterval(poll, intervalMs)

  // Return cleanup function
  return () => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  }
}
