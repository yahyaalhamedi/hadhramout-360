import { useState, useMemo, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Trash2, Plus, Pencil, Upload, X, Loader2 } from 'lucide-react'
import {
  useDiscoverContent,
  useDiscoverContentById,
  useCreateDiscoverContent,
  useUpdateDiscoverContent,
  useDeleteDiscoverContent,
} from '@/api/discover/useDiscoverContent'
import type { DiscoverContentResponseDto } from '@/api/discover/useDiscoverContent.types'
import { baseURL } from '@/api/axiosInstance'
import RichTextEditor from '@/components/atoms/RichTextEditor'

function getImageUrl(url: string | null) {
  if (!url) return undefined
  return url.startsWith('http') ? url : `${baseURL}${url}`
}

const emptyForm = {
  titleAr: '',
  titleEn: '',
  bodyAr: '',
  bodyEn: '',
}

export default function DashboardDiscover() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useDiscoverContent({
    search: search || undefined,
    pageSize: 10,
  })

  const createMutation = useCreateDiscoverContent()
  const updateMutation = useUpdateDiscoverContent()
  const deleteMutation = useDeleteDiscoverContent()

  const { data: editingDetail, isFetching: isFetchingDetail } = useDiscoverContentById(editingId ?? undefined)

  useEffect(() => {
    if (editingId && editingDetail && !form.titleAr) {
      setForm({
        titleAr: editingDetail.titleAr ?? '',
        titleEn: editingDetail.titleEn ?? '',
        bodyAr: editingDetail.bodyAr ?? '',
        bodyEn: editingDetail.bodyEn ?? '',
      })
    }
  }, [editingId, editingDetail, form.titleAr])

  const items = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? []
  }, [data])

  const totalCount = data?.pages[0]?.pagination.totalEntries ?? 0

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setCoverImage(null)
    setShowModal(true)
  }

  const openEdit = (item: DiscoverContentResponseDto) => {
    setEditingId(item.contentId)
    setForm(emptyForm)
    setCoverImage(null)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setForm(emptyForm)
    setCoverImage(null)
  }

  const handleSubmit = () => {
    if (!form.titleAr || !form.titleEn || !form.bodyAr || !form.bodyEn) return

    if (editingId) {
      updateMutation.mutate(
        { id: editingId, ...form, coverImage: coverImage ?? undefined },
        { onSuccess: closeModal },
      )
    } else {
      createMutation.mutate(
        { ...form, coverImage: coverImage ?? undefined },
        { onSuccess: closeModal },
      )
    }
  }

  const handleDelete = (id: number) => {
    if (!confirm(t('dashboard.discover.delete_confirm'))) return
    deleteMutation.mutate(id)
  }

  const coverPreview = coverImage
    ? URL.createObjectURL(coverImage)
    : editingId
      ? getImageUrl(editingDetail?.coverImageUrl ?? null)
      : null

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[40px] font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
          {t('dashboard.discover.title')}
        </h2>
        <button
          onClick={openCreate}
          className="bg-[#0a5c66] text-white px-6 py-3 rounded-xl text-[14px] font-medium hover:bg-[#094d55] transition-colors cursor-pointer flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('dashboard.discover.new')}
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder={t('dashboard.discover.search')}
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
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100/80 text-center">
          <p className="text-slate-500 text-[14px]">{t('dashboard.discover.no_results')}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item: DiscoverContentResponseDto) => (
              <div
                key={item.contentId}
                className="bg-white rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm border border-slate-100/80 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  {item.coverImageUrl ? (
                    <img src={getImageUrl(item.coverImageUrl)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">{t('dashboard.discover.no_img')}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-slate-800 truncate">
                    {item.titleEn || item.titleAr || t('dashboard.discover.untitled')}
                  </p>
                </div>
                <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer" title={t('dashboard.common.edit')}>
                  <Pencil className="h-5 w-5" />
                </button>
                <button onClick={() => handleDelete(item.contentId)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer" title={t('dashboard.common.delete')}>
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
            {t('dashboard.discover.showing', { count: items.length, total: totalCount })}
          </p>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">{editingId ? t('dashboard.discover.edit') : t('dashboard.discover.create')}</h3>
              <button onClick={closeModal} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            {editingId && isFetchingDetail ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#0a5c66]" />
                <p className="text-[14px] text-slate-500">Loading discover data...</p>
              </div>
            ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.discover.title_ar')}</label>
                  <input value={form.titleAr} onChange={(e) => setForm((p) => ({ ...p, titleAr: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.discover.title_en')}</label>
                  <input value={form.titleEn} onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.discover.body_ar')}</label>
                <RichTextEditor
                  value={form.bodyAr}
                  onChange={(val) => setForm((p) => ({ ...p, bodyAr: val }))}
                  placeholder={t('dashboard.discover.body_ar_placeholder')}
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.discover.body_en')}</label>
                <RichTextEditor
                  value={form.bodyEn}
                  onChange={(val) => setForm((p) => ({ ...p, bodyEn: val }))}
                  placeholder={t('dashboard.discover.body_en_placeholder')}
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.discover.cover_image')}</label>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)} className="hidden" />
                {coverPreview ? (
                  <div className="relative group">
                    <img src={coverPreview} alt="Cover preview" className="w-full h-40 object-cover rounded-lg border border-slate-200" />
                    <button
                      type="button"
                      onClick={() => { setCoverImage(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                      className="absolute top-2 end-2 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full h-20 px-3 rounded-lg border border-dashed border-slate-300 text-[13px] text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer flex items-center justify-center gap-2">
                    <Upload className="h-4 w-4" />
                    {t('dashboard.discover.choose_cover')}
                  </button>
                )}
              </div>
            </div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={closeModal} className="flex-1 h-10 rounded-lg border border-slate-200 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                {t('dashboard.common.cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending || !form.titleAr || !form.titleEn || !form.bodyAr || !form.bodyEn}
                className="flex-1 h-10 rounded-lg bg-[#0a5c66] text-white text-[14px] font-medium hover:bg-[#094d55] transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 animate-spin" />}
                {createMutation.isPending || updateMutation.isPending ? t('dashboard.common.saving') : editingId ? t('dashboard.common.update') : t('dashboard.common.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
