import { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, Calendar, MapPin } from 'lucide-react'
import {
  useOrgEvents,
  useCreateOrgEventWithMedia,
  useUpdateOrgEvent,
  useDeleteOrgEvent,
  useOrgEvent,
  useAddOrgEventMedia,
  useDeleteOrgEventMedia,
  useReplaceOrgEventMedia,
} from '@/api/organization/useOrgEvents'
import type { EventResponseDto } from '@/api/events/useEvents.types'
import { baseURL } from '@/api/axiosInstance'
import EventFormModal from '@/components/atoms/EventFormModal'
import type { EventFormData } from '@/components/atoms/EventFormModal'
import { emptyEventForm } from '@/components/atoms/formDefaults'
import { useGetRtl } from '@/lib/utils'
import { toast } from 'sonner'

function getImageUrl(url: string | null) {
  if (!url) return undefined
  return url.startsWith('http') ? url : `${baseURL}${url}`
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === 'ar' ? 'ar-YE' : 'en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function OrgEvents() {
  const { t, i18n } = useTranslation()
  const isRtl = useGetRtl()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<'active' | 'ended'>('active')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<EventFormData>(emptyEventForm)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [pendingDeleteMediaIds, setPendingDeleteMediaIds] = useState<number[]>([])

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useOrgEvents({
    pageSize: 10,
    ...(activeTab === 'active' ? { upcomingOnly: true } : {}),
  })

  const { data: editingEvent, isFetching: isFetchingEvent } = useOrgEvent(editingId ?? undefined)

  const createMutation = useCreateOrgEventWithMedia()
  const updateMutation = useUpdateOrgEvent()
  const deleteMutation = useDeleteOrgEvent()
  const addMediaMutation = useAddOrgEventMedia()
  const deleteMediaMutation = useDeleteOrgEventMedia()
  const replaceMediaMutation = useReplaceOrgEventMedia()

  const events = useMemo(() => {
    const all = data?.pages.flatMap((page) => page.items) ?? []
    if (activeTab === 'ended') {
      const now = new Date()
      return all.filter((ev) => new Date(ev.endDate) < now)
    }
    return all
  }, [data, activeTab])

  const totalCount = data?.pages[0]?.pagination.totalEntries ?? 0

  const openCreate = () => {
    const params = new URLSearchParams(searchParams)
    params.set('modal', 'create')
    setSearchParams(params, { replace: true })
  }

  const openEdit = (ev: EventResponseDto) => {
    const params = new URLSearchParams(searchParams)
    params.set('modal', 'edit')
    params.set('id', ev.eventId.toString())
    setSearchParams(params, { replace: true })
  }

  // Handle URL changes

  const detailLoadedForId = useRef<number | null>(null)

  useEffect(() => {
    const modalParam = searchParams.get('modal')
    const idParam = searchParams.get('id')

    if (modalParam === 'create') {
      if (!showModal && !editingId) {
        setEditingId(null)
        setForm(emptyEventForm)
        setCoverFile(null)
        setCoverPreview(null)
        setMediaFiles([])
        setPendingDeleteMediaIds([])
        detailLoadedForId.current = null
        setShowModal(true)
      }
    } else if (modalParam === 'edit' && idParam) {
      const id = parseInt(idParam, 10)
      if (!showModal || editingId !== id) {
        setEditingId(id)
        setShowModal(true)
      }
    } else {
      if (showModal) {
        setShowModal(false)
        setEditingId(null)
        setForm(emptyEventForm)
        setCoverFile(null)
        setCoverPreview(null)
        setMediaFiles([])
        setPendingDeleteMediaIds([])
        detailLoadedForId.current = null
      }
    }
  }, [searchParams])

  useEffect(() => {
    if (editingId && editingEvent && detailLoadedForId.current !== editingId) {
      setForm({
        titleAr: editingEvent.titleAr ?? '',
        titleEn: editingEvent.titleEn ?? '',
        descriptionAr: editingEvent.descriptionAr ?? '',
        descriptionEn: editingEvent.descriptionEn ?? '',
        addressAr: editingEvent.addressAr ?? '',
        addressEn: editingEvent.addressEn ?? '',
        mapUrl: editingEvent.mapUrl ?? '',
        formUrl: editingEvent.formUrl ?? '',
        startDate: editingEvent.startDate ? editingEvent.startDate.split('T')[0] : '',
        endDate: editingEvent.endDate ? editingEvent.endDate.split('T')[0] : '',
      })
      setCoverFile(null)
      const coverUrl = editingEvent.media?.[0]?.mediaUrl
      setCoverPreview(coverUrl ? (getImageUrl(coverUrl) ?? null) : null)
      setMediaFiles([])
      setPendingDeleteMediaIds([])
      detailLoadedForId.current = editingId
    }
  }, [editingId, editingEvent])


  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!form.titleAr || !form.titleEn || !form.descriptionAr || !form.descriptionEn || !form.addressAr || !form.addressEn || !form.startDate || !form.endDate) return

    setIsSubmitting(true)

    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...form })
        
        if (coverFile) {
          const existingCoverId = editingEvent?.media?.[0]?.mediaId
          if (existingCoverId) {
            await replaceMediaMutation.mutateAsync({ mediaId: existingCoverId, file: coverFile })
          } else {
            await addMediaMutation.mutateAsync({ id: editingId, file: coverFile })
          }
        }
        
        if (pendingDeleteMediaIds.length > 0) {
          await Promise.all(pendingDeleteMediaIds.map(id => deleteMediaMutation.mutateAsync(id)))
        }

        if (mediaFiles.length > 0) {
          await Promise.all(mediaFiles.map(file => addMediaMutation.mutateAsync({ id: editingId, file })))
        }

        toast.success(t('dashboard.common.update_success') || 'Updated successfully!')
        setTimeout(() => window.location.reload(), 1500)
      } else {
        await createMutation.mutateAsync({ ...form, files: mediaFiles, coverImage: coverFile ?? undefined })
        toast.success(t('dashboard.common.create_success') || 'Created successfully!')
        setTimeout(() => window.location.reload(), 1500)
      }
    } finally {
      setIsSubmitting(false)
      handleClose()
    }
  }

  const handleDelete = (id: number) => {
    if (!confirm(t('org_panel.events.delete_confirm'))) return
    deleteMutation.mutate(id)
  }

  const handleClose = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('modal')
    params.delete('id')
    setSearchParams(params, { replace: true })
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
    setPendingDeleteMediaIds((prev) => [...prev, mediaId])
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-[40px] font-bold text-slate-900"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {t('org_panel.events.title')}
        </h2>
        <button
          onClick={openCreate}
          className="bg-[#0a5c66] text-white px-6 py-3 rounded-xl text-[14px] font-medium hover:bg-[#094d55] transition-colors cursor-pointer flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('org_panel.events.create')}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[16px] font-semibold transition-colors cursor-pointer ${
            activeTab === 'active'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-100/80'
              : 'bg-[#eaf4f5] text-[#0a5c66]'
          }`}
        >
          {t('org_panel.events.tab_active')}
          <span className="bg-[#0a5c66] text-white text-[13px] font-medium px-3 py-1 rounded-full">
            {activeTab === 'active' ? totalCount : '—'}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('ended')}
          className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[16px] font-semibold transition-colors cursor-pointer ${
            activeTab === 'ended'
              ? 'bg-[#0a5c66] text-white shadow-sm'
              : 'bg-[#eaf4f5] text-[#0a5c66]'
          }`}
        >
          {t('org_panel.events.tab_ended')}
          <span className={`text-[13px] font-medium px-3 py-1 rounded-full ${
            activeTab === 'ended'
              ? 'bg-white/20 text-white'
              : 'bg-[#0a5c66] text-white'
          }`}>
            {activeTab === 'ended' ? totalCount : '—'}
          </span>
        </button>
      </div>

      {/* Events Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-[40px] bg-slate-200 h-[520px] animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100/80 text-center">
          <p className="text-slate-500 text-[14px]">{t('org_panel.events.no_results')}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6">
            {events.map((ev: EventResponseDto) => (
              <div
                key={ev.eventId}
                className="group relative h-[520px] w-full overflow-hidden rounded-[40px] cursor-pointer"
                onClick={() => navigate(`/events/${ev.eventId}`)}
              >
                {ev.coverImageUrl ? (
                  <img
                    src={getImageUrl(ev.coverImageUrl)}
                    alt={isRtl ? (ev.titleAr ?? '') : (ev.titleEn ?? '')}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#0a5c66] to-[#094d55] flex items-center justify-center">
                    <Calendar className="h-16 w-16 text-white/30" />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 flex flex-col p-5">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 overflow-hidden">
                      {ev.organizationLogoUrl ? (
                        <img
                          src={getImageUrl(ev.organizationLogoUrl)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-sm font-medium">
                          {((isRtl ? (ev.organizationNameAr ?? ev.organizationNameEn) : (ev.organizationNameEn ?? ev.organizationNameAr)) ?? 'O')[0]}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-white">
                      {isRtl
                        ? (ev.organizationNameAr || ev.organizationNameEn || t('org_panel.events.organization'))
                        : (ev.organizationNameEn || ev.organizationNameAr || t('org_panel.events.organization'))}
                    </span>
                  </div>

                  <h2 className="mb-5 text-4xl font-bold leading-tight text-white">
                    {isRtl
                      ? (ev.titleAr || ev.titleEn || t('org_panel.events.untitled'))
                      : (ev.titleEn || ev.titleAr || t('org_panel.events.untitled'))}
                  </h2>

                  <div className="mb-4 flex items-center gap-6 text-sm text-white/90">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{isRtl
                        ? (ev.addressAr || ev.addressEn || t('org_panel.events.location'))
                        : (ev.addressEn || ev.addressAr || t('org_panel.events.location'))}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(ev.startDate, i18n.language)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-auto">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(ev) }}
                      className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                      title={t('org_panel.events.edit')}
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(ev.eventId) }}
                      className="p-3 rounded-xl bg-white/10 text-white hover:bg-red-500/80 transition-colors cursor-pointer"
                      title={t('org_panel.events.delete')}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isFetchingNextPage ? t('org_panel.events.loading') : t('org_panel.events.load_more')}
              </button>
            </div>
          )}
          <p className="text-center text-[12px] text-slate-400 mt-4">
            {t('org_panel.events.showing', { count: events.length, total: totalCount })}
          </p>
        </>
      )}

      {showModal && (
        <EventFormModal
          form={form}
          setForm={setForm}
          editingId={editingId}
          isPending={isSubmitting}
          isFetchingDetail={isFetchingEvent}
          onSubmit={handleSubmit}
          onClose={handleClose}
          coverFile={coverFile}
          setCoverFile={handleCoverChange}
          coverPreview={coverPreview}
          mediaFiles={mediaFiles}
          setMediaFiles={setMediaFiles}
          existingMedia={editingEvent?.media ?? null}
          pendingDeleteMediaIds={pendingDeleteMediaIds}
          onAddMedia={handleAddMedia}
          onDeleteMedia={handleDeleteMedia}
          isAddingMedia={addMediaMutation.isPending}
          isDeletingMedia={deleteMediaMutation.isPending}
        />
      )}
    </>
  )
}
