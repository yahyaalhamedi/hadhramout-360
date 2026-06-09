import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Pencil, Trash2, Calendar, MapPin } from 'lucide-react'
import {
  useOrgEvents,
  useCreateOrgEventWithMedia,
  useUpdateOrgEvent,
  useDeleteOrgEvent,
  useOrgEvent,
  useAddOrgEventMedia,
  useDeleteOrgEventMedia,
} from '@/api/organization/useOrgEvents'
import type { EventResponseDto } from '@/api/events/useEvents.types'
import { baseURL } from '@/api/axiosInstance'
import EventFormModal, { emptyEventForm } from '@/components/atoms/EventFormModal'
import type { EventFormData } from '@/components/atoms/EventFormModal'

function getImageUrl(url: string | null) {
  if (!url) return undefined
  return url.startsWith('http') ? url : `${baseURL}${url}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function OrgEvents() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'active' | 'ended'>('active')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<EventFormData>(emptyEventForm)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useOrgEvents({
    pageSize: 10,
    upcomingOnly: activeTab === 'active' ? true : undefined,
  })

  const { data: editingEvent } = useOrgEvent(editingId ?? undefined)

  const createMutation = useCreateOrgEventWithMedia()
  const updateMutation = useUpdateOrgEvent()
  const deleteMutation = useDeleteOrgEvent()
  const addMediaMutation = useAddOrgEventMedia()
  const deleteMediaMutation = useDeleteOrgEventMedia()

  const events = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? []
  }, [data])

  const totalCount = data?.pages[0]?.pagination.totalEntries ?? 0

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyEventForm)
    setCoverFile(null)
    setCoverPreview(null)
    setMediaFiles([])
    setShowModal(true)
  }

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
    } else {
      const files = coverFile ? [coverFile, ...mediaFiles] : mediaFiles
      createMutation.mutate(
        { ...form, files },
        {
          onSuccess: () => {
            setShowModal(false)
            setForm(emptyEventForm)
            setCoverFile(null)
            setCoverPreview(null)
            setMediaFiles([])
          },
        },
      )
    }
  }

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return
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
        <h2
          className="text-[40px] font-bold text-slate-900"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          EVENTS
        </h2>
        <button
          onClick={openCreate}
          className="bg-[#0a5c66] text-white px-6 py-3 rounded-xl text-[14px] font-medium hover:bg-[#094d55] transition-colors cursor-pointer flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create event
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
          Active Events
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
          Ends Events
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
          <p className="text-slate-500 text-[14px]">No events found.</p>
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
                    alt={ev.titleEn ?? ''}
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
                          {(ev.organizationNameEn ?? ev.organizationNameAr ?? 'O')[0]}
                        </div>
                      )}
                    </div>
                    <span className="text-sm text-white">
                      {ev.organizationNameEn || ev.organizationNameAr || 'Organization'}
                    </span>
                  </div>

                  <h2 className="mb-5 text-4xl font-bold leading-tight text-white">
                    {ev.titleEn || ev.titleAr || 'Untitled Event'}
                  </h2>

                  <div className="mb-4 flex items-center gap-6 text-sm text-white/90">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{ev.addressEn || ev.addressAr || 'Location'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(ev.startDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-auto">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(ev) }}
                      className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(ev.eventId) }}
                      className="p-3 rounded-xl bg-white/10 text-white hover:bg-red-500/80 transition-colors cursor-pointer"
                      title="Delete"
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
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
          <p className="text-center text-[12px] text-slate-400 mt-4">
            Showing {events.length} of {totalCount} events
          </p>
        </>
      )}

      {showModal && (
        <EventFormModal
          form={form}
          setForm={setForm}
          editingId={editingId}
          isPending={createMutation.isPending || updateMutation.isPending}
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
