import { useRef } from 'react'
import { Calendar, MapPin, Upload, CloudUpload, X, ImageIcon, Trash2, Plus } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import type { EventMediaResponseDto } from '@/api/events/useEvents.types'
import { baseURL } from '@/api/axiosInstance'

export interface EventFormData {
  titleAr: string
  titleEn: string
  descriptionAr: string
  descriptionEn: string
  addressAr: string
  addressEn: string
  mapUrl: string
  formUrl: string
  startDate: string
  endDate: string
}

export const emptyEventForm: EventFormData = {
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

interface EventFormModalProps {
  form: EventFormData
  setForm: React.Dispatch<React.SetStateAction<EventFormData>>
  editingId: number | null
  isPending: boolean
  onSubmit: () => void
  onClose: () => void
  coverFile?: File | null
  setCoverFile?: React.Dispatch<React.SetStateAction<File | null>>
  coverPreview?: string | null
  mediaFiles?: File[]
  setMediaFiles?: React.Dispatch<React.SetStateAction<File[]>>
  existingMedia?: EventMediaResponseDto[] | null
  onAddMedia?: (file: File) => void
  onDeleteMedia?: (mediaId: number) => void
  isAddingMedia?: boolean
  isDeletingMedia?: boolean
}

function getMediaUrl(url: string | null) {
  if (!url) return ''
  return url.startsWith('http') ? url : `${baseURL}${url}`
}

export default function EventFormModal({
  form,
  setForm,
  editingId,
  isPending,
  onSubmit,
  onClose,
  coverFile,
  setCoverFile,
  coverPreview,
  mediaFiles,
  setMediaFiles,
  existingMedia,
  onAddMedia,
  onDeleteMedia,
  isAddingMedia,
  isDeletingMedia,
}: EventFormModalProps) {
  const coverInputRef = useRef<HTMLInputElement>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile?.(file)
    }
  }

  const handleMediaAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (editingId) {
      files.forEach((file) => onAddMedia?.(file))
    } else {
      setMediaFiles?.((prev) => [...prev, ...files])
    }
    if (mediaInputRef.current) mediaInputRef.current.value = ''
  }

  const handleRemoveStagedFile = (index: number) => {
    setMediaFiles?.((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        className="bg-white rounded-2xl p-8 w-full max-w-3xl shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#0a5c66]" />
            {editingId ? 'Edit Event' : 'Create Event'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Thumbnail */}
        <div className="mb-6">
          <input
            ref={coverInputRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
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
          {/* Language badges */}
          <div className="grid grid-cols-2 gap-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#0a5c66] text-white text-[11px] font-bold">EN</span>
              <span className="text-[14px] font-semibold text-slate-700">English Details</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#0a5c66] text-white text-[11px] font-bold">AR</span>
              <span className="text-[14px] font-semibold text-slate-700">Arabic Details</span>
            </div>
          </div>

          {/* Titles */}
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

          {/* Descriptions (Rich Text) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Description (EN)
              </label>
              <RichTextEditor
                value={form.descriptionEn}
                onChange={(val) => setForm((p) => ({ ...p, descriptionEn: val }))}
                placeholder="Tell the story of this event..."
              />
            </div>
            <div>
              <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                Description (AR)
              </label>
              <RichTextEditor
                value={form.descriptionAr}
                onChange={(val) => setForm((p) => ({ ...p, descriptionAr: val }))}
                placeholder="اكتب قصة هذا الحدث..."
                dir="rtl"
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

          {/* Location */}
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

          {/* Registration */}
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

          {/* Media Gallery */}
          <div className="flex items-center gap-2 mt-6 mb-2">
            <ImageIcon className="h-4 w-4 text-[#0a5c66]" />
            <span className="text-[14px] font-semibold text-slate-700">Media Gallery</span>
            {editingId && existingMedia && existingMedia.length > 0 && (
              <span className="text-[12px] text-slate-400">({existingMedia.length})</span>
            )}
            {!editingId && mediaFiles && mediaFiles.length > 0 && (
              <span className="text-[12px] text-slate-400">({mediaFiles.length})</span>
            )}
          </div>

          <input
            ref={mediaInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaAdd}
            className="hidden"
          />

          {/* Edit mode: show existing media from server */}
          {editingId && existingMedia && existingMedia.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {existingMedia.map((media) => (
                <div key={media.mediaId} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white">
                  <img
                    src={getMediaUrl(media.mediaUrl)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => onDeleteMedia(media.mediaId)}
                    disabled={isDeletingMedia}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Create mode: show staged files */}
          {!editingId && mediaFiles && mediaFiles.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {mediaFiles.map((file, index) => (
                <div key={index} className="group relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-white">
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveStagedFile(index)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-0.5 truncate px-1">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => mediaInputRef.current?.click()}
            disabled={isAddingMedia}
            className="w-full h-11 px-3 rounded-xl border border-dashed border-slate-300 text-[13px] text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <Upload className="h-4 w-4" />
            {isAddingMedia ? 'Uploading...' : 'Add Media'}
          </button>
        </div>

        {/* Actions */}
        <div className="mt-8 space-y-3">
          <button
            onClick={onSubmit}
            disabled={isPending}
            className="w-full h-12 rounded-xl bg-[#0a5c66] text-white text-[14px] font-medium hover:bg-[#094d55] transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isPending ? 'Saving...' : editingId ? 'UPDATE EVENT' : 'CREATE EVENT'}
          </button>
          <button
            onClick={onClose}
            className="w-full h-12 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
