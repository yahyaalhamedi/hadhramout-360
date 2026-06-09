import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ReportModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (reason: string) => void
  isPending?: boolean
}

export default function ReportModal({ open, onClose, onConfirm, isPending }: ReportModalProps) {
  const { t } = useTranslation()
  const [reason, setReason] = useState('')

  if (!open) return null

  const handleSubmit = () => {
    if (reason.trim()) {
      onConfirm(reason.trim())
      setReason('')
    }
  }

  const handleCancel = () => {
    setReason('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleCancel} />
      <div className="relative bg-white rounded-[24px] p-8 w-full max-w-[360px] shadow-xl z-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 h-14 w-14 rounded-2xl bg-[#fdf0e6] flex items-center justify-center">
            <AlertCircle className="h-7 w-7 text-[#c48a3a]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">
            {t('community.report_title', 'Are you sure you want to report?')}
          </h3>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t('community.report_placeholder', 'Why do you want to report?')}
            className="w-full min-h-[80px] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#c48a3a]/30 mb-4"
          />
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || isPending}
            className="w-full rounded-xl bg-[#f5d6d6] py-3 text-sm font-bold text-red-600 hover:bg-[#f1c5c5] disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isPending ? t('community.reporting', 'Reporting...') : t('label.report')}
          </button>
          <button
            onClick={handleCancel}
            className="mt-3 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
          >
            {t('label.cancel')}
          </button>
        </div>
      </div>
    </div>
  )
}
