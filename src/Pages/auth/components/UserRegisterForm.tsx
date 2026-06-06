import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, User, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { RegisterUserParams } from '@/api/auth/useAuth.types'

export interface UserRegisterFormData extends RegisterUserParams {
  confirmPassword?: string
  agreeTerms?: boolean
}

interface UserRegisterFormProps {
  onSubmit: (data: UserRegisterFormData, reset: () => void) => void
  isLoading: boolean
  onSignInClick: () => void
  isRtl: boolean
}

export default function UserRegisterForm({
  onSubmit,
  isLoading,
  onSignInClick,
  isRtl,
}: UserRegisterFormProps) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserRegisterFormData>({
    defaultValues: {
      userName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  })

  return (
    <div className="w-full bg-white rounded-[32px] p-8 md:p-10 shadow-2xl transition-all duration-300">
      <h2
        className="text-2xl font-bold text-slate-800 text-center mb-8"
        style={{ fontFamily: isRtl ? "'Thmanyah', serif" : 'inherit' }}
      >
        {t('auth.register.title')}
      </h2>

      <form
        onSubmit={handleSubmit((data) =>
          onSubmit(data, () =>
            reset({
              userName: '',
              email: '',
              phoneNumber: '',
              password: '',
              confirmPassword: '',
              agreeTerms: false,
            })
          )
        )}
        className="space-y-5"
      >
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('auth.label.fullname')}
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Salem Al-Hadrami"
              autoComplete="off"
              {...register('userName', { required: true })}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-sm font-medium text-slate-700"
            />
            <User className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400`} />
          </div>
          {errors.userName && <p className="text-xs text-destructive">{t('auth.error.fullname_required', 'Full name is required')}</p>}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('auth.label.email')}
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="name@example.com"
              {...register('email', { required: true })}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-sm font-medium text-slate-700"
            />
            <Mail className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400`} />
          </div>
          {errors.email && <p className="text-xs text-destructive">{t('auth.error.email_required')}</p>}
        </div>

        {/* Phone Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('auth.label.phone')}
          </label>
          <div className="relative">
            <input
              type="tel"
              placeholder="+967..."
              {...register('phoneNumber')}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-sm font-medium text-slate-700"
            />
            <Phone className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400`} />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('auth.label.password')}
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('password', { required: true, minLength: 6 })}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-sm font-medium text-slate-700"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer`}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{t('auth.error.password_required')}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('auth.label.confirm_password')}
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              {...register('confirmPassword', { required: true })}
              className="w-full h-12 px-4 rounded-2xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-sm font-medium text-slate-700"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={`absolute ${isRtl ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer`}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-destructive">{t('auth.error.confirm_password_required', 'Confirm password is required')}</p>}
        </div>

        {/* Agree Terms Checkbox */}
        <div className="flex items-center gap-2 py-1">
          <input
            type="checkbox"
            id="agreeTerms"
            {...register('agreeTerms', { required: true })}
            className="h-4 w-4 rounded border-slate-300 text-[#0a5c66] focus:ring-[#0a5c66]"
          />
          <label htmlFor="agreeTerms" className="text-xs text-slate-500 cursor-pointer select-none">
            {t('auth.label.agree_terms')}
          </label>
        </div>
        {errors.agreeTerms && <p className="text-xs text-destructive">{t('auth.error.agree_terms_required', 'You must agree to the Terms')}</p>}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-full bg-[#0a5c66] hover:bg-[#084951] text-white font-bold cursor-pointer transition-all flex items-center justify-center text-base"
        >
          {isLoading ? t('label.loading') : t('auth.button.create_account')}
        </Button>

        {/* Sign In Link */}
        <div className="text-center mt-4 text-sm text-slate-500 font-semibold">
          {t('auth.link.already_have_account')}
          <button
            type="button"
            onClick={onSignInClick}
            className="text-[#0a5c66] hover:underline font-bold cursor-pointer ml-1 mr-1"
          >
            {t('auth.button.login')}
          </button>
        </div>
      </form>
    </div>
  )
}
