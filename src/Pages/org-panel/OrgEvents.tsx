import { useState, useMemo, useRef } from 'react'
import { Plus, Pencil, Trash2, Calendar, MapPin, Upload, CloudUpload } from 'lucide-react'
import {
  useOrgEvents,
  useCreateOrgEventWithMedia,
  useUpdateOrgEvent,
  useDeleteOrgEvent,
} from '@/api/organization/useOrgEvents'
import type { EventResponseDto } from '@/api/events/useEvents.types'
import { baseURL } from '@/api/axiosInstance'

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

const emptyForm = {
  titleAr: '',
  titleEn: '',
  descriptionAr: '',
  descriptionEn: '',
  addressAr: '',
  addressEn: '',
  mapUrl: '',
  formUrl: '',
  startDate: '',
  endDate: '',
}

export default function OrgEvents() {
  const [activeTab, setActiveTab] = useState<'active' | 'ended'>('active')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [files, setFiles] = useState<File[]>([])
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useOrgEvents({
    pageSize: 10,
    upcomingOnly: activeTab === 'active' ? true : undefined,
  })

  const createMutation = useCreateOrgEventWithMedia()
  const updateMutation = useUpdateOrgEvent()
  const deleteMutation = useDeleteOrgEvent()

  const events = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? []
  }, [data])

  const totalCount = data?.pages[0]?.pagination.totalEntries ?? 0

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFiles([])
    setCoverPreview(null)
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
    setFiles([])
    setCoverPreview(null)
    setShowModal(true)
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
            setForm(emptyForm)
          },
        },
      )
    } else {
      createMutation.mutate(
        { ...form, files },
        {
          onSuccess: () => {
            setShowModal(false)
            setForm(emptyForm)
            setFiles([])
            setCoverPreview(null)
          },
        },
      )
    }
  }

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    deleteMutation.mutate(id)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files ?? [])
    setFiles(selectedFiles)
    if (selectedFiles.length > 0) {
      const reader = new FileReader()
      reader.onloadend = () => setCoverPreview(reader.result as string)
      reader.readAsDataURL(selectedFiles[0])
    }
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
                className="group relative h-[520px] w-full overflow-hidden rounded-[40px]"
              >
                {/* Background Image */}
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

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 flex flex-col p-5">
                  {/* Author */}
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

                  {/* Title */}
                  <h2 className="mb-5 text-4xl font-bold leading-tight text-white">
                    {ev.titleEn || ev.titleAr || 'Untitled Event'}
                  </h2>

                  {/* Meta */}
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

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 mt-auto">
                    <button
                      onClick={() => openEdit(ev)}
                      className="p-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(ev.eventId)}
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

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#0a5c66]" />
              {editingId ? 'Edit Event' : 'Event Media'}
            </h3>

            {/* Cover Image Upload */}
            <div className="mb-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer"
              >
                {coverPreview ? (
                  <img src={coverPreview} alt="Preview" className="h-32 rounded-lg object-cover" />
                ) : (
                  <>
                    <CloudUpload className="h-10 w-10 text-slate-400" />
                    <span className="text-[14px] font-medium">Upload Event Image</span>
                    <span className="text-[12px] text-slate-400">PNG, JPG up to 5MB</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-5">
              {/* English / Arabic Details */}
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded bg-[#0a5c66] text-white text-[11px] font-bold">EN</span>
                <span className="text-[14px] font-semibold text-slate-700">English Details</span>
                <span className="ml-4 px-2 py-0.5 rounded bg-[#0a5c66] text-white text-[11px] font-bold">AR</span>
                <span className="text-[14px] font-semibold text-slate-700">Arabic Details</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Event Title (EN)
                  </label>
                  <input
                    value={form.titleEn}
                    onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))}
                    placeholder="e.g. Shibam Sunset Pottery Workshop"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Event Title (AR)
                  </label>
                  <input
                    value={form.titleAr}
                    onChange={(e) => setForm((p) => ({ ...p, titleAr: e.target.value }))}
                    placeholder="مثال: ورشة فخار غروب شيبام"
                    dir="rtl"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Description (EN)
                  </label>
                  <textarea
                    value={form.descriptionEn}
                    onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))}
                    rows={3}
                    placeholder="Tell the story of this event..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 resize-none bg-[#f8f9fa]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Description (AR)
                  </label>
                  <textarea
                    value={form.descriptionAr}
                    onChange={(e) => setForm((p) => ({ ...p, descriptionAr: e.target.value }))}
                    rows={3}
                    placeholder="اكتب قصة هذا الحدث..."
                    dir="rtl"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 resize-none bg-[#f8f9fa]"
                  />
                </div>
              </div>

              {/* Schedule */}
              <div className="flex items-center gap-2 mt-6 mb-2">
                <Calendar className="h-4 w-4 text-[#0a5c66]" />
                <span className="text-[14px] font-semibold text-slate-700">Schedule</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
                  />
                </div>
              </div>

              {/* Location Details */}
              <div className="flex items-center gap-2 mt-6 mb-2">
                <MapPin className="h-4 w-4 text-[#0a5c66]" />
                <span className="text-[14px] font-semibold text-slate-700">Location Details</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Address (EN)
                  </label>
                  <input
                    value={form.addressEn}
                    onChange={(e) => setForm((p) => ({ ...p, addressEn: e.target.value }))}
                    placeholder="e.g. Al-Omar Heritage Square"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Address (AR)
                  </label>
                  <input
                    value={form.addressAr}
                    onChange={(e) => setForm((p) => ({ ...p, addressAr: e.target.value }))}
                    placeholder="مثال: ساحة عمر التراثية"
                    dir="rtl"
                    className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Google Maps URL
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    value={form.mapUrl}
                    onChange={(e) => setForm((p) => ({ ...p, mapUrl: e.target.value }))}
                    placeholder="https://maps.google.com/..."
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
                  />
                </div>
              </div>

              {/* Registration Link */}
              <div className="flex items-center gap-2 mt-6 mb-2">
                <span className="text-[14px] font-semibold text-slate-700">Registration Link</span>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Registration Form URL
                </label>
                <input
                  value={form.formUrl}
                  onChange={(e) => setForm((p) => ({ ...p, formUrl: e.target.value }))}
                  placeholder="https://..."
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
                />
                <p className="text-[12px] text-slate-400 mt-1">
                  Add an external registration or participation form link if available.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full h-12 rounded-xl bg-[#0a5c66] text-white text-[14px] font-medium hover:bg-[#094d55] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {createMutation.isPending || updateMutation.isPending
                  ? 'Saving...'
                  : editingId
                    ? 'UPDATE EVENT'
                    : 'CREATE EVENT'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingId(null)
                  setForm(emptyForm)
                  setFiles([])
                  setCoverPreview(null)
                }}
                className="w-full h-12 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
