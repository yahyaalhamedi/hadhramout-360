import { useState, useMemo, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Trash2, Plus, Pencil, Upload, Loader2 } from 'lucide-react'
import {
  useLandmarks,
  useLandmark,
  useCreateLandmarkWithMedia,
  useUpdateLandmark,
  useDeleteLandmark,
} from '@/api/landmarks/useLandmarks'
import { useCategories } from '@/api/categories/useCategories'
import type { LandmarkResponseDto } from '@/api/landmarks/useLandmarks.types'
import { baseURL } from '@/api/axiosInstance'
import DeleteConfirmModal from '@/components/atoms/DeleteConfirmModal'

function getImageUrl(url: string | null) {
  if (!url) return undefined
  return url.startsWith('http') ? url : `${baseURL}${url}`
}

const emptyForm = {
  titleAr: '',
  titleEn: '',
  descriptionAr: '',
  descriptionEn: '',
  locationTextAr: '',
  locationTextEn: '',
  mapUrl: '',
  categoryIds: [] as number[],
}

export default function DashboardLandmarks() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useLandmarks({
    search: search || undefined,
    pageSize: 10,
  })

  const { data: categories = [] } = useCategories()
  const { data: editingDetail, isFetching: isFetchingDetail } = useLandmark(editingId ?? undefined)
  const createMutation = useCreateLandmarkWithMedia()
  const updateMutation = useUpdateLandmark()
  const deleteMutation = useDeleteLandmark()

  const landmarks = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? []
  }, [data])

  const totalCount = data?.pages[0]?.pagination.totalEntries ?? 0

  useEffect(() => {
    if (editingId && editingDetail && !form.descriptionAr && editingDetail.descriptionAr) {
      setForm({
        titleAr: editingDetail.titleAr ?? '',
        titleEn: editingDetail.titleEn ?? '',
        descriptionAr: editingDetail.descriptionAr ?? '',
        descriptionEn: editingDetail.descriptionEn ?? '',
        locationTextAr: editingDetail.locationTextAr ?? '',
        locationTextEn: editingDetail.locationTextEn ?? '',
        mapUrl: editingDetail.mapUrl ?? '',
        categoryIds: editingDetail.categories?.map((c) => c.categoryId) ?? [],
      })
    }
  }, [editingId, editingDetail, form.descriptionAr])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFiles([])
    setShowModal(true)
  }

  const openEdit = (lm: LandmarkResponseDto) => {
    setEditingId(lm.landmarkId)
    setForm({
      titleAr: lm.titleAr ?? '',
      titleEn: lm.titleEn ?? '',
      descriptionAr: '',
      descriptionEn: '',
      locationTextAr: lm.locationTextAr ?? '',
      locationTextEn: lm.locationTextEn ?? '',
      mapUrl: lm.mapUrl ?? '',
      categoryIds: lm.categories?.map((c) => c.categoryId) ?? [],
    })
    setFiles([])
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!form.titleAr || !form.titleEn || !form.descriptionAr || !form.descriptionEn || !form.mapUrl) return

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
    setDeleteId(id)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          setDeleteModalOpen(false)
          setDeleteId(null)
        },
      })
    }
  }

  const toggleCategory = (id: number) => {
    setForm((p) => ({
      ...p,
      categoryIds: p.categoryIds.includes(id)
        ? p.categoryIds.filter((c) => c !== id)
        : [...p.categoryIds, id],
    }))
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[40px] font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
          {t('dashboard.landmarks.title')}
        </h2>
        <button
          onClick={openCreate}
          className="bg-[#0a5c66] text-white px-6 py-3 rounded-xl text-[14px] font-medium hover:bg-[#094d55] transition-colors cursor-pointer flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('dashboard.landmarks.new')}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder={t('dashboard.landmarks.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 pl-5 pr-12 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 transition-all"
        />
      </div>

      {/* List */}
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
      ) : landmarks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100/80 text-center">
          <p className="text-slate-500 text-[14px]">{t('dashboard.landmarks.no_results')}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {landmarks.map((lm: LandmarkResponseDto) => (
              <div
                key={lm.landmarkId}
                className="bg-white rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm border border-slate-100/80 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  {lm.coverMediaUrl ? (
                    <img src={getImageUrl(lm.coverMediaUrl)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">{t('dashboard.landmarks.no_img')}</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-slate-800 truncate">
                    {lm.titleEn || lm.titleAr || t('dashboard.landmarks.untitled')}
                  </p>
                  <div className="flex gap-1.5 mt-1 flex-wrap">
                    {lm.categories?.map((c) => (
                      <span key={c.categoryId} className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                        {c.categoryNameEn || c.categoryNameAr}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => openEdit(lm)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer"
                  title={t('dashboard.common.edit')}
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(lm.landmarkId)}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  title={t('dashboard.common.delete')}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
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
                {isFetchingNextPage ? t('dashboard.common.loading') : t('dashboard.common.load_more')}
              </button>
            </div>
          )}
          <p className="text-center text-[12px] text-slate-400 mt-4">
            {t('dashboard.landmarks.showing', { count: landmarks.length, total: totalCount })}
          </p>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-6">
              {editingId ? t('dashboard.landmarks.edit') : t('dashboard.landmarks.create')}
            </h3>
            {editingId && isFetchingDetail ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#0a5c66]" />
                <p className="text-[14px] text-slate-500">Loading landmark data...</p>
              </div>
            ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.landmarks.title_ar')}</label>
                  <input value={form.titleAr} onChange={(e) => setForm((p) => ({ ...p, titleAr: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.landmarks.title_en')}</label>
                  <input value={form.titleEn} onChange={(e) => setForm((p) => ({ ...p, titleEn: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.landmarks.desc_ar')}</label>
                  <textarea value={form.descriptionAr} onChange={(e) => setForm((p) => ({ ...p, descriptionAr: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 resize-none" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.landmarks.desc_en')}</label>
                  <textarea value={form.descriptionEn} onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 resize-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.landmarks.location_ar')}</label>
                  <input value={form.locationTextAr} onChange={(e) => setForm((p) => ({ ...p, locationTextAr: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.landmarks.location_en')}</label>
                  <input value={form.locationTextEn} onChange={(e) => setForm((p) => ({ ...p, locationTextEn: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" />
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.landmarks.map_url')}</label>
                <input value={form.mapUrl} onChange={(e) => setForm((p) => ({ ...p, mapUrl: e.target.value }))} className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20" placeholder="https://maps.google.com/..." />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.landmarks.categories')}</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.categoryId}
                      type="button"
                      onClick={() => toggleCategory(cat.categoryId)}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors cursor-pointer ${
                        form.categoryIds.includes(cat.categoryId)
                          ? 'bg-[#0a5c66] text-white border-[#0a5c66]'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat.categoryNameEn || cat.categoryNameAr}
                    </button>
                  ))}
                  {categories.length === 0 && <p className="text-[12px] text-slate-400">{t('dashboard.landmarks.no_categories')}</p>}
                </div>
              </div>
              {!editingId && (
                <div>
                  <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.landmarks.media_files')}</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-10 px-3 rounded-lg border border-dashed border-slate-300 text-[13px] text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    {files.length > 0 ? t('dashboard.landmarks.files_selected', { count: files.length }) : t('dashboard.landmarks.choose_files')}
                  </button>
                </div>
              )}
            </div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setEditingId(null); setForm(emptyForm); setFiles([]) }} className="flex-1 h-10 rounded-lg border border-slate-200 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer">
                {t('dashboard.common.cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={!form.titleAr || !form.titleEn || !form.descriptionAr || !form.descriptionEn || !form.mapUrl || createMutation.isPending || updateMutation.isPending}
                className="flex-1 h-10 rounded-lg bg-[#0a5c66] text-white text-[14px] font-medium hover:bg-[#094d55] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {createMutation.isPending || updateMutation.isPending ? t('dashboard.common.saving') : editingId ? t('dashboard.common.update') : t('dashboard.common.create')}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeleteId(null) }}
        onConfirm={handleDeleteConfirm}
        isPending={deleteMutation.isPending}
        message={t('dashboard.landmarks.delete_confirm')}
      />
    </>
  )
}
