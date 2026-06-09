import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useGetRtl } from '@/lib/utils'
import { baseURL } from '@/api/axiosInstance'
import { useTranslation } from 'react-i18next'

interface DiscoverCardProps {
  imageUrl: string
  title: string
  onClick: () => void
  className?: string
}

export default function DiscoverCard({
  imageUrl,
  title,
  onClick,
  className,
}: DiscoverCardProps) {
  const { t } = useTranslation()
  const isRtl = useGetRtl()
  const image = `${baseURL}${imageUrl}`

  return (
    <div
      className={`group relative h-[520px] w-full cursor-pointer overflow-hidden rounded-[40px] ${className}`}
      onClick={onClick}
    >
      {/* Background Image */}
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col p-5">
        {/* Title */}
        <h2 className="mb-8 text-4xl font-bold leading-tight text-white">{title}</h2>

        {/* Button */}
        <button
          className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#F3E7D7] text-lg font-semibold text-[#B98B4A] transition-colors hover:bg-[#F3E7D7]/90 cursor-pointer"
        >
          {t('label.view_details')}
          {isRtl ? <ArrowLeft className="ml-2 h-5 w-5" /> : <ArrowRight className="ml-2 h-5 w-5" />}
        </button>
      </div>
    </div>
  )
}
