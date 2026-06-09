import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Trash2, Pencil } from 'lucide-react'
import {
  useEvents,
  useUpdateEvent,
  useDeleteEvent,
  useAddEventMedia,
  useDeleteEventMedia,
  useEvent,
} from '@/api/events/useEvents'
import type { EventResponseDto } from '@/api/events/useEvents.types'
import { baseURL } from '@/api/axiosInstance'
import EventFormModal, { emptyEventForm } from '@/components/atoms/EventFormModal'
import type { EventFormData } from '@/components/atoms/EventFormModal'

function getImageUrl(url: string | null) {
  if (!url) return undefined
  return url.startsWith('http') ? url : `${baseURL}${url}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function DashboardEvents() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<EventFormData>(emptyEventForm)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useEvents({
    search: search || undefined,
    pageSize: 10,
  })

  const { data: editingEvent } = useEvent(editingId ?? undefined)

  const updateMutation = useUpdateEvent()
  const deleteMutation = useDeleteEvent()
  const addMediaMutation = useAddEventMedia()
  const deleteMediaMutation = useDeleteEventMedia()

  const events = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? []
  }, [data])

  const totalCount = data?.pages[0]?.pagination.totalEntries ?? 0

  const openEdit = (ev: EventResponseDto) => {
    setEditingId(ev.eventId)
    setForm({
      titleAr: ev.titleAr ?? '',
      titleEn: ev.titleEn ?? '',
      descriptionAr: '',
      descriptionEn: '',
      addressAr: ev.addressAr ?? '',
      addressEn: ev.addressEn ?? '',
      mapUrl: '',
      formUrl: '',
      startDate: ev.startDate ? new Date(ev.startDate).toISOString().slice(0, 10) : '',
      endDate: ev.endDate ? new Date(ev.endDate).toISOString().slice(0, 10) : '',
    })
    setCoverFile(null)
    setCoverPreview(null)
    setMediaFiles([])
    setShowModal(true)
  }

  if (editingId && editingEvent && !form.descriptionAr && editingEvent.descriptionAr) {
    setForm((prev) => ({
      ...prev,
      descriptionAr: editingEvent.descriptionAr ?? '',
      descriptionEn: editingEvent.descriptionEn ?? '',
      addressAr: editingEvent.addressAr ?? prev.addressAr,
      addressEn: editingEvent.addressEn ?? prev.addressEn,
      mapUrl: editingEvent.mapUrl ?? '',
      formUrl: editingEvent.formUrl ?? '',
    }))
  }

  const handleSubmit = () => {
    if (!form.titleAr || !form.titleEn || !form.descriptionAr || !form.descriptionEn || !form.addressAr || !form.addressEn || !form.startDate || !form.endDate) return

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, ...form },
        {
          onSuccess: () => {
            setShowModal(false)
            setEditingId(null)
            setForm(emptyEventForm)
          },
        },
      )
    }
  }

  const handleDelete = (id: number) => {
    if (!confirm(t('dashboard.events.delete_confirm'))) return
    deleteMutation.mutate(id)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingId(null)
    setForm(emptyEventForm)
    setCoverFile(null)
    setCoverPreview(null)
    setMediaFiles([])
  }

  const handleCoverChange = (file: File | null) => {
    setCoverFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setCoverPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setCoverPreview(null)
    }
  }

  const handleAddMedia = (file: File) => {
    if (!editingId) return
    addMediaMutation.mutate({ id: editingId, file })
  }

  const handleDeleteMedia = (mediaId: number) => {
    deleteMediaMutation.mutate(mediaId)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[40px] font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
          {t('dashboard.events.title')}
        </h2>
      </div>

      <div className="relative mb-6">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder={t('dashboard.events.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 pl-5 pr-12 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 transition-all"
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-slate-100/80 animate-pulse">
              <div className="w-16 h-16 rounded-xl bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 bg-slate-200 rounded" />
                <div className="h-3 w-32 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100/80 text-center">
          <p className="text-slate-500 text-[14px]">{t('dashboard.events.no_results')}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {events.map((ev: EventResponseDto) => (
              <div
                key={ev.eventId}
                className="bg-white rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm border border-slate-100/80 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  {ev.coverImageUrl ? (
                    <img src={getImageUrl(ev.coverImageUrl)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">{t('dashboard.events.no_img')}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-slate-800 truncate">
                    {ev.titleEn || ev.titleAr || t('dashboard.events.untitled')}
                  </p>
                  <p className="text-[12px] text-slate-400 mt-0.5">
                    {formatDate(ev.startDate)} - {formatDate(ev.endDate)}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                  {ev.organizationNameEn || ev.organizationNameAr || t('dashboard.events.org')}
                </span>
                <button onClick={() => openEdit(ev)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer" title={t('dashboard.common.edit')}>
                  <Pencil className="h-5 w-5" />
                </button>
                <button onClick={() => handleDelete(ev.eventId)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer" title={t('dashboard.common.delete')}>
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer">
                {isFetchingNextPage ? t('dashboard.common.loading') : t('dashboard.common.load_more')}
              </button>
            </div>
          )}
          <p className="text-center text-[12px] text-slate-400 mt-4">
            {t('dashboard.events.showing', { count: events.length, total: totalCount })}
          </p>
        </>
      )}

      {showModal && (
        <EventFormModal
          form={form}
          setForm={setForm}
          editingId={editingId}
          isPending={updateMutation.isPending}
          onSubmit={handleSubmit}
          onClose={handleClose}
          coverFile={coverFile}
          setCoverFile={handleCoverChange}
          coverPreview={coverPreview}
          mediaFiles={mediaFiles}
          setMediaFiles={setMediaFiles}
          existingMedia={editingEvent?.media ?? null}
          onAddMedia={handleAddMedia}
          onDeleteMedia={handleDeleteMedia}
          isAddingMedia={addMediaMutation.isPending}
          isDeletingMedia={deleteMediaMutation.isPending}
        />
      )}
    </>
  )
}
