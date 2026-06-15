import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { CloudUpload } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import type { FormRenderProps } from './DashboardCrudPage'

export interface DiscoverFormData {
  titleAr: string
  titleEn: string
  bodyAr: string
  bodyEn: string
}



export default function DiscoverFormFields({
  form,
  setForm,
  coverFile,
  setCoverFile,
  coverPreview,
}: FormRenderProps<DiscoverFormData>) {
  const { t } = useTranslation()
  const coverInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-5">
      {/* Cover Image */}
      <div className="mb-6">
        <input ref={coverInputRef} type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} className="hidden" />
        <button
          type="button"
          onClick={() => coverInputRef.current?.click()}
          className={`w-full h-40 border-2 border-dashed ${coverFile ? 'border-green-500 bg-green-50/50' : 'border-slate-300'} rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer relative overflow-hidden`}
        >
          {coverPreview ? (
            <>
              <img src={coverPreview} alt="Preview" className="h-full w-full object-cover rounded-lg" />
              {coverFile && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-sm">
                  New Cover
                </div>
              )}
            </>
          ) : (
            <>
              <CloudUpload className="h-10 w-10 text-slate-400" />
              <span className="text-[14px] font-medium">{t('dashboard.discover.upload_cover') || 'Upload Cover Image'}</span>
              <span className="text-[12px] text-slate-400">{t('dashboard.discover.image_hint') || 'JPG, PNG up to 5MB'}</span>
            </>
          )}
        </button>
      </div>

      {/* Language badges */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#0a5c66] text-white text-[11px] font-bold">EN</span>
          <span className="text-[14px] font-semibold text-slate-700">{t('dashboard.event_form.english_details') || 'English Details'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#0a5c66] text-white text-[11px] font-bold">AR</span>
          <span className="text-[14px] font-semibold text-slate-700">{t('dashboard.event_form.arabic_details') || 'Arabic Details'}</span>
        </div>
      </div>

      {/* Titles */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('dashboard.discover.title_ar')}</label>
          <input value={form.titleAr} onChange={(e) => setForm((p) => ({ ...p, titleAr: e.target.value }))} dir="rtl" className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]" />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('dashboard.discover.title_en')}</label>
          <input value={form.titleEn} onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))} className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]" />
        </div>
      </div>

      {/* Bodies (Rich Text) */}
      <div>
        <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('dashboard.discover.body_ar')}</label>
        <RichTextEditor
          value={form.bodyAr}
          onChange={(val) => setForm((p) => ({ ...p, bodyAr: val }))}
          placeholder={t('dashboard.discover.body_ar_placeholder')}
          dir="rtl"
        />
      </div>
      <div>
        <label className="block text-[12px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">{t('dashboard.discover.body_en')}</label>
        <RichTextEditor
          value={form.bodyEn}
          onChange={(val) => setForm((p) => ({ ...p, bodyEn: val }))}
          placeholder={t('dashboard.discover.body_en_placeholder')}
        />
      </div>
    </div>
  )
}
