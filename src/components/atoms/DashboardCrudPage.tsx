import { useState, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Search, Trash2, Pencil, Plus, Loader2, X } from 'lucide-react'
import { baseURL } from '@/api/axiosInstance'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
import DeleteConfirmModal from './DeleteConfirmModal'

function getImageUrl(url: string | null) {
  if (!url) return undefined
  return url.startsWith('http') ? url : `${baseURL}${url}`
}

export interface FormRenderProps<TForm> {
  form: TForm
  setForm: React.Dispatch<React.SetStateAction<TForm>>
  editingId: number | null
  isFetchingDetail: boolean
  coverFile: File | null
  setCoverFile: (file: File | null) => void
  coverPreview: string | null
  mediaFiles: File[]
  setMediaFiles: React.Dispatch<React.SetStateAction<File[]>>
  existingMedia: any[] | null
  onAddMedia?: (file: File) => void
  onDeleteMedia?: (mediaId: number) => void
  isAddingMedia?: boolean
  isDeletingMedia?: boolean
  pendingDeleteMediaIds?: number[]
}

export interface DashboardCrudPageProps<TListItem, TDetail, TForm> {
  titleKey: string
  searchPlaceholderKey: string
  noResultsKey: string
  untitledKey: string
  deleteConfirmKey: string
  newButtonKey?: string
  formTitleKey: string
  formEditTitleKey: string
  noImageKey?: string
  modalIcon?: React.ReactNode
  modalWidth?: string

  useList: (params: { search: string; pageSize: number }) => any
  useDetail: (id: number | undefined) => any
  useCreate: () => any
  useUpdate: () => any
  useDelete: () => any
  useAddMedia?: () => any
  useDeleteMedia?: () => any
  useReplaceMedia?: () => any

  getListItemId: (item: TListItem) => number
  getListItemTitle: (item: TListItem) => string
  getListItemImage: (item: TListItem) => string | null | undefined
  getListItemBadge?: (item: TListItem) => string | null | undefined
  renderListItemContent?: (item: TListItem) => React.ReactNode

  emptyForm: TForm
  validateForm: (form: TForm) => boolean
  detailToForm: (detail: TDetail) => TForm
  buildCreatePayload: (form: TForm, coverFile: File | null, mediaFiles: File[]) => any
  buildUpdatePayload: (id: number, form: TForm) => any
  getExistingMedia?: (detail: TDetail) => any[] | null

  renderForm: (props: FormRenderProps<TForm>) => React.ReactNode

  showCreateButton?: boolean
}

export default function DashboardCrudPage<TListItem, TDetail, TForm>({
  titleKey,
  searchPlaceholderKey,
  noResultsKey,
  untitledKey,
  deleteConfirmKey,
  newButtonKey,
  formTitleKey,
  formEditTitleKey,
  noImageKey,
  modalIcon,
  modalWidth = 'max-w-3xl',
  useList,
  useDetail,
  useCreate,
  useUpdate,
  useDelete,
  useAddMedia,
  useDeleteMedia,
  useReplaceMedia,
  getListItemId,
  getListItemTitle,
  getListItemImage,
  getListItemBadge,
  renderListItemContent,
  emptyForm,
  validateForm,
  detailToForm,
  buildCreatePayload,
  buildUpdatePayload,
  getExistingMedia,
  renderForm,
  showCreateButton = true,
}: DashboardCrudPageProps<TListItem, TDetail, TForm>) {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<TForm>(emptyForm)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [pendingDeleteMediaIds, setPendingDeleteMediaIds] = useState<number[]>([])

  const detailLoadedForId = useRef<number | null>(null)

  const listResult = useList({ search, pageSize: 10 })
  const detailResult = useDetail(editingId ?? undefined)
  const createResult = useCreate()
  const updateResult = useUpdate()
  const deleteResult = useDelete()
  const addMediaResult = useAddMedia?.()
  const deleteMediaResult = useDeleteMedia?.()
  const replaceMediaResult = useReplaceMedia?.()

  const items = useMemo(() => {
    return listResult.data?.pages?.flatMap((page: any) => page.items) ?? []
  }, [listResult.data])

  const totalCount = listResult.data?.pages?.[0]?.pagination.totalEntries ?? 0

  // When editingId changes, reset form and detailLoadedForId
  useEffect(() => {
    if (editingId) {
      setForm(emptyForm)
      setCoverFile(null)
      setCoverPreview(null)
      setMediaFiles([])
      setPendingDeleteMediaIds([])
      detailLoadedForId.current = null
    }
  }, [editingId])

  // When detail loads for editing, populate form (only once per editing session)
  useEffect(() => {
    if (editingId && detailResult.data && detailLoadedForId.current !== editingId) {
      setForm(detailToForm(detailResult.data))
      detailLoadedForId.current = editingId
    }
  }, [editingId, detailResult.data])

  useEffect(() => {
    const modalParam = searchParams.get('modal')
    const idParam = searchParams.get('id')

    if (modalParam === 'create') {
      if (!showModal && !editingId) {
        setEditingId(null)
        setForm(emptyForm)
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
        setForm(emptyForm)
        setCoverFile(null)
        setCoverPreview(null)
        setMediaFiles([])
        setPendingDeleteMediaIds([])
        detailLoadedForId.current = null
      }
    }
  }, [searchParams])

  const openCreate = () => {
    const params = new URLSearchParams(searchParams)
    params.set('modal', 'create')
    setSearchParams(params, { replace: true })
  }

  const openEdit = (item: TListItem) => {
    const params = new URLSearchParams(searchParams)
    params.set('modal', 'edit')
    params.set('id', getListItemId(item).toString())
    setSearchParams(params, { replace: true })
  }

  const closeModal = () => {
    const params = new URLSearchParams(searchParams)
    params.delete('modal')
    params.delete('id')
    setSearchParams(params, { replace: true })
  }

  const handleSubmit = () => {
    if (!validateForm(form)) return

    if (editingId) {
      updateResult.mutate(buildUpdatePayload(editingId, form), {
        onSuccess: async () => {
          const promises = []
          
          if (coverFile) {
            const currentMedia = getExistingMedia?.(detailResult.data)
            const existingCoverId = currentMedia?.[0]?.mediaId ?? currentMedia?.[0]?.id
            if (existingCoverId && replaceMediaResult) {
              await replaceMediaResult.mutateAsync({ mediaId: existingCoverId, file: coverFile })
            } else if (addMediaResult) {
              await addMediaResult.mutateAsync({ id: editingId, file: coverFile })
            }
          }

          if (deleteMediaResult && pendingDeleteMediaIds.length > 0) {
            promises.push(...pendingDeleteMediaIds.map((id) => deleteMediaResult.mutateAsync(id)))
          }
          if (addMediaResult && mediaFiles.length > 0) {
            promises.push(...mediaFiles.map((file) => addMediaResult.mutateAsync({ id: editingId, file })))
          }
          if (promises.length > 0) {
            await Promise.all(promises)
          }
          await queryClient.invalidateQueries()
          toast.success(t('dashboard.common.update_success') || 'Updated successfully!')
          closeModal()
        },
      })
    } else {
      createResult.mutate(buildCreatePayload(form, coverFile, mediaFiles), {
        onSuccess: async () => {
          await queryClient.invalidateQueries()
          toast.success(t('dashboard.common.create_success') || 'Created successfully!')
          closeModal()
        },
      })
    }
  }

  const handleDelete = (id: number) => {
    setDeleteId(id)
    setDeleteModalOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (deleteId !== null) {
      deleteResult.mutate(deleteId, {
        onSuccess: async () => {
          await queryClient.invalidateQueries()
          setDeleteModalOpen(false)
          setDeleteId(null)
        },
      })
    }
  }

  const handleAddMedia = (file: File) => {
    if (!editingId || !addMediaResult) return
    addMediaResult.mutate({ id: editingId, file })
  }

  const handleDeleteMedia = (mediaId: number) => {
    setPendingDeleteMediaIds((prev) => [...prev, mediaId])
  }

  const existingMedia = editingId && getExistingMedia && detailResult.data
    ? getExistingMedia(detailResult.data)
    : null

  const currentCoverPreview = coverPreview
    ? coverPreview
    : editingId && detailResult.data
      ? getImageUrl(
          (detailResult.data as any).coverImageUrl ?? 
          (detailResult.data as any).coverMediaUrl ?? 
          (detailResult.data as any).media?.[0]?.mediaUrl ?? 
          null
        ) ?? null
      : null

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[40px] font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
          {t(titleKey)}
        </h2>
        {showCreateButton && newButtonKey && (
          <button
            onClick={openCreate}
            className="bg-[#0a5c66] text-white px-6 py-3 rounded-xl text-[14px] font-medium hover:bg-[#094d55] transition-colors cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t(newButtonKey)}
          </button>
        )}
      </div>

      <div className="relative mb-6">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder={t(searchPlaceholderKey)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 pl-5 pr-12 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 transition-all"
        />
      </div>

      {listResult.isLoading ? (
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
          <p className="text-slate-500 text-[14px]">{t(noResultsKey)}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((item: TListItem) => (
              <div
                key={getListItemId(item)}
                className="bg-white rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm border border-slate-100/80 hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                  {getListItemImage(item) ? (
                    <img src={getImageUrl(getListItemImage(item)!)} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      {noImageKey ? t(noImageKey) : ''}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-slate-800 truncate">
                    {getListItemTitle(item) || t(untitledKey)}
                  </p>
                  {renderListItemContent?.(item)}
                </div>
                {getListItemBadge && getListItemBadge(item) && (
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
                    {getListItemBadge(item)}
                  </span>
                )}
                <button
                  onClick={() => openEdit(item)}
                  className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors cursor-pointer"
                  title={t('dashboard.common.edit')}
                >
                  <Pencil className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(getListItemId(item))}
                  className="p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                  title={t('dashboard.common.delete')}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>

          {listResult.hasNextPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => listResult.fetchNextPage()}
                disabled={listResult.isFetchingNextPage}
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {listResult.isFetchingNextPage ? t('dashboard.common.loading') : t('dashboard.common.load_more')}
              </button>
            </div>
          )}
          <p className="text-center text-[12px] text-slate-400 mt-4">
            Showing {items.length} of {totalCount}
          </p>
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            className={`bg-white rounded-2xl p-8 w-full ${modalWidth} shadow-xl max-h-[90vh] overflow-y-auto`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                {modalIcon}
                {editingId ? t(formEditTitleKey) : t(formTitleKey)}
              </h3>
              <button
                onClick={closeModal}
                className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {editingId && detailResult.isFetching ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-[#0a5c66]" />
                <p className="text-[14px] text-slate-500">Loading...</p>
              </div>
            ) : (
              renderForm({
                form,
                setForm,
                editingId,
                isFetchingDetail: detailResult.isFetching,
                coverFile,
                setCoverFile: (file) => {
                  setCoverFile(file)
                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => setCoverPreview(reader.result as string)
                    reader.readAsDataURL(file)
                  } else {
                    setCoverPreview(null)
                  }
                },
                coverPreview: currentCoverPreview,
                mediaFiles,
                setMediaFiles,
                existingMedia: existingMedia ?? null,
                onAddMedia: useAddMedia ? handleAddMedia : undefined,
                onDeleteMedia: useDeleteMedia ? handleDeleteMedia : undefined,
                isAddingMedia: addMediaResult?.isPending,
                isDeletingMedia: deleteMediaResult?.isPending,
                pendingDeleteMediaIds,
              })
            )}

            <div className="mt-8 space-y-3">
              <button
                onClick={handleSubmit}
                disabled={!validateForm(form) || createResult.isPending || updateResult.isPending}
                className="w-full h-12 rounded-xl bg-[#0a5c66] text-white text-[14px] font-medium hover:bg-[#094d55] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {createResult.isPending || updateResult.isPending
                  ? t('dashboard.common.saving')
                  : editingId
                    ? t('dashboard.common.update')
                    : t('dashboard.common.create')}
              </button>
              <button
                onClick={closeModal}
                className="w-full h-12 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {t('dashboard.common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirmModal
        open={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeleteId(null) }}
        onConfirm={handleDeleteConfirm}
        isPending={deleteResult.isPending}
        message={t(deleteConfirmKey)}
      />
    </>
  )
}
