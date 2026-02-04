export interface RadioStation {
  id: string
  name: string
  streamUrl: string
  logoUrl: string
  color: string
  country: string
  metadataUrl?: string
  website?: string
}

export const radioStations: RadioStation[] = [
  {
    id: 'france-inter',
    name: 'France Inter',
    streamUrl: 'https://icecast.radiofrance.fr/franceinter-midfi.mp3',
    logoUrl:
      'https://www.radiofrance.fr/s3/cruiser-production/2021/10/d4e5d47d-7217-4bd5-9dd5-6e1fd2d7ab5e/200x200_franceinter.png',
    color: '#e2001a',
    country: 'FR',
    website: 'https://www.radiofrance.fr/franceinter',
  },
  {
    id: 'rtl',
    name: 'RTL',
    streamUrl: 'https://icecast.rtl.fr/rtl-1-44-128',
    logoUrl:
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23ff6b00" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial Black" font-size="80" fill="white" font-weight="bold"%3ERTL%3C/text%3E%3C/svg%3E',
    color: '#ff6b00',
    country: 'FR',
    website: 'https://www.rtl.fr',
  },
  {
    id: 'ici-besancon',
    name: 'Ici Besançon',
    streamUrl: 'https://icecast.radiofrance.fr/fbbesancon-midfi.mp3',
    logoUrl:
      'https://www.radiofrance.fr/s3/cruiser-production/2021/10/8b0e3a95-37bf-4a2c-b867-f653c5e6e0e0/200x200_francebleu.png',
    color: '#0055a4',
    country: 'FR',
    website: 'https://www.radiofrance.fr/francebleu/besancon',
  },
  {
    id: 'france-musique',
    name: 'France Musique',
    streamUrl: 'https://icecast.radiofrance.fr/francemusique-midfi.mp3',
    logoUrl:
      'https://www.radiofrance.fr/s3/cruiser-production/2021/10/4c79241a-547e-4c39-af5e-d3d0ac2d4e67/200x200_francemusique.png',
    color: '#9b59b6',
    country: 'FR',
    website: 'https://www.radiofrance.fr/francemusique',
  },
  {
    id: 'france-culture',
    name: 'France Culture',
    streamUrl: 'https://icecast.radiofrance.fr/franceculture-midfi.mp3',
    logoUrl:
      'https://www.radiofrance.fr/s3/cruiser-production/2021/10/268c6dca-8acd-4e67-b0e8-6d2d615ad374/200x200_franceculture.png',
    color: '#8e44ad',
    country: 'FR',
    website: 'https://www.radiofrance.fr/franceculture',
  },
  {
    id: 'rts',
    name: 'RTS',
    streamUrl: 'https://stream.srg-ssr.ch/m/la-1ere/mp3_128',
    logoUrl:
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23d32f2f" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial Black" font-size="70" fill="white" font-weight="bold"%3ERTS%3C/text%3E%3C/svg%3E',
    color: '#d32f2f',
    country: 'CH',
    website: 'https://www.rts.ch/audio/la-1ere/',
  },
  {
    id: 'fip',
    name: 'FIP',
    streamUrl: 'https://icecast.radiofrance.fr/fip-midfi.mp3',
    logoUrl:
      'https://www.radiofrance.fr/s3/cruiser-production/2021/10/5f7f8ecb-4e1f-4b93-9061-0d0d0a1e7e7e/200x200_fip.png',
    color: '#ff1493',
    country: 'FR',
    website: 'https://www.radiofrance.fr/fip',
  },
  {
    id: 'grrif',
    name: 'GRRIF',
    streamUrl: 'https://grrif.ice.infomaniak.ch/grrif-128.mp3',
    logoUrl:
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%2300bcd4" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial Black" font-size="50" fill="white" font-weight="bold"%3EGRRIF%3C/text%3E%3C/svg%3E',
    color: '#00bcd4',
    country: 'CH',
    website: 'https://www.grrif.ch',
  },
  {
    id: 'canal-b',
    name: 'Canal B',
    streamUrl: 'https://stream.levillage.org/canalb',
    logoUrl:
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%234caf50" width="200" height="200"/%3E%3Ctext x="50%25" y="45%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial Black" font-size="50" fill="white" font-weight="bold"%3ECanal%3C/text%3E%3Ctext x="50%25" y="65%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial Black" font-size="80" fill="white" font-weight="bold"%3EB%3C/text%3E%3C/svg%3E',
    color: '#4caf50',
    country: 'FR',
    website: 'https://www.canalb.fr',
  },
  {
    id: 'wfmu',
    name: 'WFMU',
    streamUrl: 'https://stream0.wfmu.org/freeform-128k',
    logoUrl:
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Crect fill="%23ffc107" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial Black" font-size="50" fill="%23000" font-weight="bold"%3EWFMU%3C/text%3E%3C/svg%3E',
    color: '#ffc107',
    country: 'US',
    website: 'https://wfmu.org',
  },
]

export function getStationById(id: string): RadioStation | undefined {
  return radioStations.find((station) => station.id === id)
}
