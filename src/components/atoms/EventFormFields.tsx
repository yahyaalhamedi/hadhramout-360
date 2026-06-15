import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar, MapPin, Upload, CloudUpload, ImageIcon, Trash2 } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import { baseURL } from '@/api/axiosInstance'
import type { FormRenderProps } from './DashboardCrudPage'
import type { EventFormData } from '@/components/atoms/EventFormModal'

function getMediaUrl(url: string | null) {
  if (!url) return ''
  return url.startsWith('http') ? url : `${baseURL}${url}`
}

export default function EventFormFields({
  form,
  setForm,
  editingId,
  coverFile,
  setCoverFile,
  coverPreview,
  mediaFiles,
  setMediaFiles,
  existingMedia,
  onDeleteMedia,
  isAddingMedia,
  isDeletingMedia,
  pendingDeleteMediaIds,
}: FormRenderProps<EventFormData>) {
  const { t } = useTranslation()
  const coverInputRef = useRef<HTMLInputElement>(null)
  const mediaInputRef = useRef<HTMLInputElement>(null)

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
    }
  }

  const handleMediaAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setMediaFiles((prev) => [...prev, ...files])
    if (mediaInputRef.current) mediaInputRef.current.value = ''
  }

  const handleRemoveStagedFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const existingCoverId = existingMedia?.[0]?.mediaId || existingMedia?.[0]?.id
  const isExistingCoverPendingDelete = existingCoverId && pendingDeleteMediaIds?.includes(existingCoverId)

  return (
    <div className="space-y-5">
      {/* Cover Image */}
      <div className="mb-6 relative">
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
          className={`w-full h-40 border-2 border-dashed ${coverFile ? 'border-green-500 bg-green-50/50' : isExistingCoverPendingDelete ? 'border-red-500 opacity-50' : 'border-slate-300'} rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer relative overflow-hidden`}
        >
          {coverPreview ? (
            <>
              <img src={coverPreview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
              {coverFile && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm">
                  New Cover
                </div>
              )}
              {isExistingCoverPendingDelete && !coverFile && (
                <div className="absolute inset-0 bg-red-500/10 flex flex-col items-center justify-center">
                  <Trash2 className="h-6 w-6 text-red-500 mb-1" />
                  <span className="text-[10px] font-bold text-red-500 uppercase">Pending Delete</span>
                </div>
              )}
            </>
          ) : (
            <>
              <CloudUpload className="h-10 w-10 text-slate-400" />
              <span className="text-[14px] font-medium">{t('dashboard.event_form.upload_image')}</span>
              <span className="text-[12px] text-slate-400">{t('dashboard.event_form.image_hint')}</span>
              <span className="text-[11px] text-[#0a5c66] max-w-[80%] text-center mt-1">{t('dashboard.event_form.cover_hint2')}</span>
            </>
          )}
        </button>
        {/* Delete Button for Cover */}
        {(coverPreview || coverFile) && !isExistingCoverPendingDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              if (coverFile) {
                setCoverFile(null)
              } else if (existingCoverId) {
                onDeleteMedia?.(existingCoverId)
              }
            }}
            disabled={isDeletingMedia}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white hover:bg-red-500 transition-colors cursor-pointer disabled:opacity-50 z-10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Language badges */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#0a5c66] text-white text-[11px] font-bold">EN</span>
          <span className="text-[14px] font-semibold text-slate-700">{t('dashboard.event_form.english_details')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#0a5c66] text-white text-[11px] font-bold">AR</span>
          <span className="text-[14px] font-semibold text-slate-700">{t('dashboard.event_form.arabic_details')}</span>
        </div>
      </div>

      {/* Titles */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            {t('dashboard.event_form.title_en')}
          </label>
          <input
            value={form.titleEn}
            onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))}
            placeholder={t('dashboard.event_form.title_en_placeholder')}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            {t('dashboard.event_form.title_ar')}
          </label>
          <input
            value={form.titleAr}
            onChange={(e) => setForm((p) => ({ ...p, titleAr: e.target.value }))}
            placeholder={t('dashboard.event_form.title_ar_placeholder')}
            dir="rtl"
            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
          />
        </div>
      </div>

      {/* Descriptions (Rich Text) */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            {t('dashboard.event_form.desc_en')}
          </label>
          <RichTextEditor
            value={form.descriptionEn}
            onChange={(val) => setForm((p) => ({ ...p, descriptionEn: val }))}
            placeholder={t('dashboard.event_form.desc_en_placeholder')}
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            {t('dashboard.event_form.desc_ar')}
          </label>
          <RichTextEditor
            value={form.descriptionAr}
            onChange={(val) => setForm((p) => ({ ...p, descriptionAr: val }))}
            placeholder={t('dashboard.event_form.desc_ar_placeholder')}
            dir="rtl"
          />
        </div>
      </div>

      {/* Schedule */}
      <div className="flex items-center gap-2 mt-6 mb-2">
        <Calendar className="h-4 w-4 text-[#0a5c66]" />
        <span className="text-[14px] font-semibold text-slate-700">{t('dashboard.event_form.schedule')}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            {t('dashboard.event_form.start_date')}
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
            {t('dashboard.event_form.end_date')}
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
        <span className="text-[14px] font-semibold text-slate-700">{t('dashboard.event_form.location_details')}</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            {t('dashboard.event_form.address_en')}
          </label>
          <input
            value={form.addressEn}
            onChange={(e) => setForm((p) => ({ ...p, addressEn: e.target.value }))}
            placeholder={t('dashboard.event_form.address_en_placeholder')}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            {t('dashboard.event_form.address_ar')}
          </label>
          <input
            value={form.addressAr}
            onChange={(e) => setForm((p) => ({ ...p, addressAr: e.target.value }))}
            placeholder={t('dashboard.event_form.address_ar_placeholder')}
            dir="rtl"
            className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          {t('dashboard.event_form.google_maps_url')}
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
        <span className="text-[14px] font-semibold text-slate-700">{t('dashboard.event_form.registration_link')}</span>
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
          {t('dashboard.event_form.registration_form_url')}
        </label>
        <input
          value={form.formUrl}
          onChange={(e) => setForm((p) => ({ ...p, formUrl: e.target.value }))}
          placeholder="https://..."
          className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
        />
        <p className="text-[12px] text-slate-400 mt-1">
          {t('dashboard.event_form.registration_hint')}
        </p>
      </div>

      {/* Media Gallery */}
      <div className="flex flex-col mt-6 mb-2">
        <div className="flex items-center gap-2 mb-1">
          <ImageIcon className="h-4 w-4 text-[#0a5c66]" />
          <span className="text-[14px] font-semibold text-slate-700">{t('dashboard.event_form.media_gallery')}</span>
          {editingId && existingMedia && existingMedia.length > 1 && (
            <span className="text-[12px] text-slate-400">({existingMedia.length - 1})</span>
          )}
          {!editingId && mediaFiles.length > 0 && (
            <span className="text-[12px] text-slate-400">({mediaFiles.length})</span>
          )}
        </div>
        <span className="text-[11px] text-slate-500">{t('dashboard.event_form.media_hint')}</span>
      </div>

      <input
        ref={mediaInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={handleMediaAdd}
        className="hidden"
      />

      {/* Edit mode: show existing media from server (skip index 0 which is the cover) */}
      {editingId && existingMedia && existingMedia.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {existingMedia.slice(1).map((media: any) => {
            const isPendingDelete = pendingDeleteMediaIds?.includes(media.mediaId)
            return (
              <div key={media.mediaId} className={`group relative aspect-square rounded-xl overflow-hidden border ${isPendingDelete ? 'border-red-500 opacity-50' : 'border-slate-200'} bg-white`}>
                <img
                  src={getMediaUrl(media.mediaUrl)}
                  alt=""
                  className="w-full h-full object-cover"
                />
                {!isPendingDelete && (
                  <button
                    onClick={() => onDeleteMedia?.(media.mediaId)}
                    disabled={isDeletingMedia}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 cursor-pointer disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
                {isPendingDelete && (
                  <div className="absolute inset-0 bg-red-500/10 flex flex-col items-center justify-center">
                    <Trash2 className="h-6 w-6 text-red-500 mb-1" />
                    <span className="text-[10px] font-bold text-red-500 uppercase">Pending Delete</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Create mode: show staged files */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {mediaFiles.map((file, index) => (
            <div key={index} className="group relative aspect-square rounded-xl overflow-hidden border-2 border-green-500 bg-white">
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-green-500 rounded-xl pointer-events-none" />
              <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm">
                New
              </div>
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
        {isAddingMedia ? t('dashboard.event_form.uploading') : t('dashboard.event_form.add_media')}
      </button>
    </div>
  )
}
