import { ExternalLink } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface MapCardProps {
  mapUrl?: string | null
  venue: string
  venueDetail?: string
}

export default function MapCard({ mapUrl, venue, venueDetail }: MapCardProps) {
  const { t } = useTranslation()

  if (!mapUrl) return null

  /**
   * Transforms a standard Google Maps URL into a secure, embeddable iframe URL.
   * Handles coordinates (?q=lat,lng), place paths (/maps/place/...), searches (/maps/search/...),
   * and already-embeddable links.
   */
  const getEmbedUrl = (url: string): string => {
    if (url.includes('embed') || url.includes('pb=')) {
      return url
    }

    try {
      const urlObj = new URL(url)

      // 1. Handle ?q= query parameter (e.g. ?q=lat,lng or search query)
      const q = urlObj.searchParams.get('q')
      if (q) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed`
      }

      // 2. Handle /maps/place/Name
      const placeMatch = urlObj.pathname.match(/\/maps\/place\/([^/]+)/)
      if (placeMatch?.[1]) {
        return `https://maps.google.com/maps?q=${placeMatch[1]}&output=embed`
      }

      // 3. Handle /maps/search/Query
      const searchMatch = urlObj.pathname.match(/\/maps\/search\/([^/]+)/)
      if (searchMatch?.[1]) {
        return `https://maps.google.com/maps?q=${searchMatch[1]}&output=embed`
      }
    } catch {
      // Fallback when mapUrl is a plain coordinate string or non-standard URL
    }

    // Fallback: Embed via the input query itself
    return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed`
  }

  const embedUrl = getEmbedUrl(mapUrl)

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <iframe
        title={t('landmark.map.title', 'Map Location')}
        src={embedUrl}
        className="h-48 w-full border-0 bg-muted"
        loading="lazy"
        allowFullScreen
      />
      <div className="px-4 py-3">
        <p className="text-sm font-semibold text-foreground">{venue}</p>
        {venueDetail && <p className="text-xs text-muted-foreground">{venueDetail}</p>}
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-border py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <ExternalLink className="h-4 w-4" />
          {t('label.open_in_maps', 'Open in Maps')}
        </a>
      </div>
    </div>
  )
}
