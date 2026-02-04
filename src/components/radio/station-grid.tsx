import { radioStations } from '@/lib/radio-stations'
import { StationButton } from './station-button'
import type { RadioStation } from '@/lib/radio-stations'

interface StationGridProps {
  currentStation: RadioStation | null
  isPlaying: boolean
  onStationSelect: (station: RadioStation) => void
}

export function StationGrid({
  currentStation,
  isPlaying,
  onStationSelect,
}: StationGridProps) {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {radioStations.map((station) => (
          <StationButton
            key={station.id}
            station={station}
            isActive={currentStation?.id === station.id}
            isPlaying={isPlaying}
            onClick={() => onStationSelect(station)}
          />
        ))}
      </div>
    </div>
  )
}
