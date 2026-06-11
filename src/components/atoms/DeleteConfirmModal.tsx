import { Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface DeleteConfirmModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  isPending?: boolean
  message?: string
}

export default function DeleteConfirmModal({ open, onClose, onConfirm, isPending, message }: DeleteConfirmModalProps) {
  const { t } = useTranslation()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] p-8 w-full max-w-[360px] shadow-xl z-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 h-14 w-14 rounded-2xl bg-[#fdf0e6] flex items-center justify-center">
            <Trash2 className="h-7 w-7 text-[#c48a3a]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-6">
            {message ?? t('dashboard.common.delete_confirm')}
          </h3>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="w-full rounded-xl bg-[#f5d6d6] py-3 text-sm font-bold text-red-600 hover:bg-[#f1c5c5] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isPending ? t('dashboard.common.deleting') : t('dashboard.common.delete')}
          </button>
          <button
            onClick={onClose}
            className="mt-3 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            {t('label.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
