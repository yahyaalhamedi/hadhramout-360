import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, Mail, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LoginParams } from '@/api/auth/useAuth.types'

interface LoginFormProps {
  onSubmit: (data: LoginParams, reset: () => void) => void
  isLoading: boolean
  onCreateAccountClick: () => void
  isRtl: boolean
}

export default function LoginForm({
  onSubmit,
  isLoading,
  onCreateAccountClick,
  isRtl,
}: LoginFormProps) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginParams>({
    defaultValues: { email: '', password: '' },
  })

  return (
    <div className="w-full bg-white rounded-[32px] p-8 md:p-10 shadow-2xl transition-all duration-300">
      <h2
        className="text-2xl font-bold text-slate-800 text-center mb-8"
        style={{ fontFamily: isRtl ? "'Thmanyah', serif" : 'inherit' }}
      >
        {t('auth.login.title')}
      </h2>

      <form
        onSubmit={handleSubmit((data) => onSubmit(data, () => reset({ email: '', password: '' })))}
        className="space-y-6"
        autoComplete="off"
      >
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('auth.label.email')}
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="name@example.com"
              autoComplete="off"
              {...register('email', { required: true })}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-sm font-medium text-slate-700"
            />
            <Mail
              className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{t('auth.error.email_required')}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('auth.label.password')}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              {...register('password', { required: true })}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-sm font-medium text-slate-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600`}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{t('auth.error.password_required')}</p>
          )}
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-full bg-[#0a5c66] hover:bg-[#084951] text-white font-bold cursor-pointer transition-all flex items-center justify-center text-base"
        >
          {isLoading ? t('label.loading', 'Loading...') : t('auth.button.login')}
        </Button>

        {/* Create account link */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={onCreateAccountClick}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#0a5c66] hover:underline cursor-pointer"
          >
            {t('auth.link.create_account')}
            {isRtl ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </form>
    </div>
  )
}
