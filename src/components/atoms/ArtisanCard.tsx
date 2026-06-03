import { ArrowRight, ArrowLeft } from 'lucide-react'
import { cn, useGetRtl } from '@/lib/utils'
import { baseURL } from '@/api/axiosInstance'

interface ArtisanCardProps {
  imageUrl: string
  name: string
  onClick: () => void
  className?: string
}

export default function ArtisanCard({
  imageUrl,
  name,
  onClick,
  className,
}: ArtisanCardProps) {
  const isRtl = useGetRtl()
  const image = `${baseURL}${imageUrl}`

  return (
    <div
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-[24px] bg-white transition-shadow hover:shadow-lg',
        className,
      )}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-[24px]">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold text-secondary-8">{name}</h3>
        </div>
        <button
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer',
            'bg-secondary text-secondary-8 hover:bg-secondary-1',
          )}
          aria-label={`View ${name}`}
        >
          {isRtl ? (
            <ArrowLeft className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}
