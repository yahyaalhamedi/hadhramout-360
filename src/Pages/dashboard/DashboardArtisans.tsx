import { useState, useMemo, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Trash2, Plus, Pencil, Upload, Loader2 } from 'lucide-react'
import {
  useArtisans,
  useArtisan,
  useCreateArtisanWithMedia,
  useUpdateArtisan,
  useDeleteArtisan,
} from '@/api/artisans/useArtisans'
import type { ArtisanResponseDto } from '@/api/artisans/useArtisans.types'
import { baseURL } from '@/api/axiosInstance'

function getImageUrl(url: string | null) {
  if (!url) return undefined
  return url.startsWith('http') ? url : `${baseURL}${url}`
}

const emptyForm = {
  nameAr: '',
  nameEn: '',
  phone: '',
  descriptionAr: '',
  descriptionEn: '',
  locationTextAr: '',
  locationTextEn: '',
  mapUrl: '',
}

export default function DashboardArtisans() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useArtisans({
    search: search || undefined,
    pageSize: 10,
  })

  const { data: editingDetail, isFetching: isFetchingDetail } = useArtisan(editingId ?? undefined)

  const createMutation = useCreateArtisanWithMedia()
  const updateMutation = useUpdateArtisan()
  const deleteMutation = useDeleteArtisan()

  const artisans = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? []
  }, [data])

  const totalCount = data?.pages[0]?.pagination.totalEntries ?? 0

  useEffect(() => {
    if (editingId && editingDetail && !form.descriptionAr && editingDetail.descriptionAr) {
      setForm({
        nameAr: editingDetail.nameAr ?? '',
        nameEn: editingDetail.nameEn ?? '',
        phone: editingDetail.phone ?? '',
        descriptionAr: editingDetail.descriptionAr ?? '',
        descriptionEn: editingDetail.descriptionEn ?? '',
        locationTextAr: editingDetail.locationTextAr ?? '',
        locationTextEn: editingDetail.locationTextEn ?? '',
        mapUrl: editingDetail.mapUrl ?? '',
      })
    }
  }, [editingId, editingDetail, form.descriptionAr])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFiles([])
    setShowModal(true)
  }

  const openEdit = (a: ArtisanResponseDto) => {
    setEditingId(a.artisanId)
    setForm({
      nameAr: a.nameAr ?? '',
      nameEn: a.nameEn ?? '',
      phone: '',
      descriptionAr: '',
      descriptionEn: '',
      locationTextAr: '',
      locationTextEn: '',
      mapUrl: '',
    })
    setFiles([])
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!form.nameAr || !form.nameEn || !form.phone || !form.descriptionAr || !form.descriptionEn) return

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
    if (!confirm(t('dashboard.artisans.delete_confirm'))) return
    deleteMutation.mutate(id)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[40px] font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
          {t('dashboard.artisans.title')}
        </h2>
        <button
          onClick={openCreate}
          className="bg-[#0a5c66] text-white px-6 py-3 rounded-xl text-[14px] font-medium hover:bg-[#094d55] transition-colors cursor-pointer flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('dashboard.artisans.new')}
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder={t('dashboard.artisans.search')}
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
      ) : artisans.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100/80 text-center">
          <p className="text-slate-500 text-[14px]">{t('dashboard.artisans.no_results')}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {artisans.map((a: ArtisanResponseDto) => (
              <div
                key={a.artisanId}
                className="bg-white rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm border border-slate-100/80 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  {a.coverImageUrl ? (
                    <img src={getImageUrl(a.coverImageUrl)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">{t('dashboard.artisans.no_img')}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-slate-800 truncate">
                    {a.nameEn || a.nameAr || t('dashboard.artisans.untitled')}
                  </p>
                </div>
                <button onClick={() => openEdit(a)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer" title={t('dashboard.common.edit')}>
                  <Pencil className="h-5 w-5" />
                </button>
                <button onClick={() => handleDelete(a.artisanId)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer" title={t('dashboard.common.delete')}>
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
            {t('dashboard.artisans.showing', { count: artisans.length, total: totalCount })}
          </p>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-6">{editingId ? t('dashboard.artisans.edit') : t('dashboard.artisans.create')}</h3>
            {editingId && isFetchingDetail ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#0a5c66]" />
                <p className="text-[14px] text-slate-500">Loading artisan data...</p>
              </div>
            ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.artisans.name_ar')}</label>
                  <input value={form.nameAr} onChange={(e) => setForm((p) => ({ ...p, nameAr: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.artisans.name_en')}</label>
                  <input value={form.nameEn} onChange={(e) => setForm((p) => ({ ...p, nameEn: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.artisans.phone')}</label>
                <input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.artisans.desc_ar')}</label>
                  <textarea value={form.descriptionAr} onChange={(e) => setForm((p) => ({ ...p, descriptionAr: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 resize-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.artisans.desc_en')}</label>
                  <textarea value={form.descriptionEn} onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 resize-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.artisans.location_ar')}</label>
                  <input value={form.locationTextAr} onChange={(e) => setForm((p) => ({ ...p, locationTextAr: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.artisans.location_en')}</label>
                  <input value={form.locationTextEn} onChange={(e) => setForm((p) => ({ ...p, locationTextEn: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.artisans.map_url')}</label>
                <input value={form.mapUrl} onChange={(e) => setForm((p) => ({ ...p, mapUrl: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" placeholder="https://maps.google.com/..." />
              </div>
              {!editingId && (
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.artisans.media_files')}</label>
                  <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple onChange={(e) => setFiles(Array.from(e.target.files ?? []))} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-10 px-3 rounded-lg border border-dashed border-slate-300 text-[13px] text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="h-4 w-4" />
                    {files.length > 0 ? t('dashboard.artisans.files_selected', { count: files.length }) : t('dashboard.artisans.choose_files')}
                  </button>
                </div>
              )}
            </div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm); setFiles([]) }} className="flex-1 h-10 rounded-lg border border-slate-200 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">{t('dashboard.common.cancel')}</button>
              <button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 h-10 rounded-lg bg-[#0a5c66] text-white text-[14px] font-medium hover:bg-[#094d55] transition-colors disabled:opacity-50 cursor-pointer">
                {createMutation.isPending || updateMutation.isPending ? t('dashboard.common.saving') : editingId ? t('dashboard.common.update') : t('dashboard.common.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
