import { LogOut } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface LogoutModalProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function LogoutModal({ open, onClose, onConfirm }: LogoutModalProps) {
  const { t } = useTranslation()

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] p-8 w-full max-w-[400px] shadow-xl z-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-5 h-16 w-16 rounded-2xl bg-[#fdf0e6] flex items-center justify-center">
            <LogOut className="h-8 w-8 text-[#c48a3a]" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {t('logout.title', 'Are you sure you want to log out?')}
          </h3>
          <p className="text-sm text-slate-500 mb-6 max-w-[280px]">
            {t('logout.description', 'You will need to sign in again to access your account')}
          </p>
          <button
            onClick={onConfirm}
            className="w-full rounded-xl bg-[#f5d6d6] py-3.5 text-sm font-bold text-red-600 hover:bg-[#f1c5c5] transition-colors cursor-pointer"
          >
            {t('logout.confirm', 'Logout')}
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
