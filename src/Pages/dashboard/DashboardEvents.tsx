import { useState, useMemo, useRef } from 'react'
import { Search, Trash2, Plus, Pencil, Upload } from 'lucide-react'
import {
  useEvents,
  useCreateEventWithMedia,
  useUpdateEvent,
  useDeleteEvent,
} from '@/api/events/useEvents'
import type { EventResponseDto } from '@/api/events/useEvents.types'
import { baseURL } from '@/api/axiosInstance'

function getImageUrl(url: string | null) {
  if (!url) return undefined
  return url.startsWith('http') ? url : `${baseURL}${url}`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

export default function DashboardEvents() {
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useEvents({
    search: search || undefined,
    pageSize: 10,
  })

  const createMutation = useCreateEventWithMedia()
  const updateMutation = useUpdateEvent()
  const deleteMutation = useDeleteEvent()

  const events = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? []
  }, [data])

  const totalCount = data?.pages[0]?.pagination.totalEntries ?? 0

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFiles([])
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
      startDate: ev.startDate ? new Date(ev.startDate).toISOString().slice(0, 16) : '',
      endDate: ev.endDate ? new Date(ev.endDate).toISOString().slice(0, 16) : '',
    })
    setFiles([])
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
          },
        },
      )
    }
  }

  const handleDelete = (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    deleteMutation.mutate(id)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[40px] font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
          EVENTS
        </h2>
        <button
          onClick={openCreate}
          className="bg-[#0a5c66] text-white px-6 py-3 rounded-xl text-[14px] font-medium hover:bg-[#094d55] transition-colors cursor-pointer flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Event
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search events..."
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
          <p className="text-slate-500 text-[14px]">No events found.</p>
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
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No img</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-slate-800 truncate">
                    {ev.titleEn || ev.titleAr || 'Untitled'}
                  </p>
                  <p className="text-[12px] text-slate-400 mt-0.5">
                    {formatDate(ev.startDate)} - {formatDate(ev.endDate)}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                  {ev.organizationNameEn || ev.organizationNameAr || 'Org'}
                </span>
                <button onClick={() => openEdit(ev)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer" title="Edit">
                  <Pencil className="h-5 w-5" />
                </button>
                <button onClick={() => handleDelete(ev.eventId)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer" title="Delete">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-6">{editingId ? 'Edit Event' : 'New Event'}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Title (AR) *</label>
                  <input value={form.titleAr} onChange={(e) => setForm((p) => ({ ...p, titleAr: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Title (EN) *</label>
                  <input value={form.titleEn} onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Description (AR) *</label>
                  <textarea value={form.descriptionAr} onChange={(e) => setForm((p) => ({ ...p, descriptionAr: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 resize-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Description (EN) *</label>
                  <textarea value={form.descriptionEn} onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 resize-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Address (AR) *</label>
                  <input value={form.addressAr} onChange={(e) => setForm((p) => ({ ...p, addressAr: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Address (EN) *</label>
                  <input value={form.addressEn} onChange={(e) => setForm((p) => ({ ...p, addressEn: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Start Date *</label>
                  <input type="datetime-local" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">End Date *</label>
                  <input type="datetime-local" value={form.endDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Map URL</label>
                <input value={form.mapUrl} onChange={(e) => setForm((p) => ({ ...p, mapUrl: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" placeholder="https://maps.google.com/..." />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Registration URL</label>
                <input value={form.formUrl} onChange={(e) => setForm((p) => ({ ...p, formUrl: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" placeholder="https://..." />
              </div>
              {!editingId && (
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">Media Files</label>
                  <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-10 px-3 rounded-lg border border-dashed border-slate-300 text-[13px] text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="h-4 w-4" />
                    {files.length > 0 ? `${files.length} file(s) selected` : 'Choose files...'}
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm); setFiles([]) }} className="flex-1 h-10 rounded-lg border border-slate-200 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 h-10 rounded-lg bg-[#0a5c66] text-white text-[14px] font-medium hover:bg-[#094d55] transition-colors disabled:opacity-50 cursor-pointer">
                {createMutation.isPending || updateMutation.isPending ? 'Saving...' : editingId ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
