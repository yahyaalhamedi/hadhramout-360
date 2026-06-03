import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Eye, EyeOff, UploadCloud, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { RegisterOrganizationParams } from '@/api/auth/useAuth.types'

export interface OrgRegisterFormData extends RegisterOrganizationParams {
  confirmPassword?: string
  agreeTermsOrg?: boolean
}

interface OrgRegisterFormProps {
  onSubmit: (data: OrgRegisterFormData, logoFile: File | null, reset: () => void) => void
  isLoading: boolean
  onSignInClick: () => void
  isRtl: boolean
}

export default function OrgRegisterForm({
  onSubmit,
  isLoading,
  onSignInClick,
  isRtl,
}: OrgRegisterFormProps) {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrgRegisterFormData>({
    defaultValues: {
      orgNameAr: '',
      orgNameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      addressAr: '',
      addressEn: '',
      mapUrl: '',
      userName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      agreeTermsOrg: false,
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const resetAll = () => {
    reset({
      orgNameAr: '',
      orgNameEn: '',
      descriptionAr: '',
      descriptionEn: '',
      addressAr: '',
      addressEn: '',
      mapUrl: '',
      userName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
      agreeTermsOrg: false,
    })
    setLogoFile(null)
    setLogoPreview(null)
  }

  const handleFormSubmit = (data: OrgRegisterFormData) => {
    onSubmit(data, logoFile, resetAll)
  }

  return (
    <div className="w-full max-w-2xl bg-white rounded-[32px] p-6 md:p-8 shadow-2xl transition-all duration-300 mx-auto">
      <h2
        className="text-2xl font-bold text-slate-800 text-center mb-6"
        style={{ fontFamily: isRtl ? "'Thmanyah', serif" : 'inherit' }}
      >
        {t('auth.register_org.title')}
      </h2>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        {/* File upload zone */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('auth.org.logo')}
          </label>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-2xl p-4 bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo Preview"
                className="h-16 w-16 object-cover rounded-full border"
              />
            ) : (
              <UploadCloud className="h-8 w-8 text-[#0a5c66] mb-1 group-hover:scale-105 transition-transform" />
            )}
            <p className="text-xs font-bold text-slate-600 mt-1">{t('auth.org.upload')}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">{t('auth.org.upload_desc')}</p>
          </div>
        </div>

        {/* Two Column details: Org Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('auth.org.name_en')}
            </label>
            <input
              type="text"
              placeholder="e.g. Shibam Heritage Trust"
              {...register('orgNameEn', { required: true })}
              className="w-full h-10 px-4 rounded-xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-xs font-medium text-slate-700"
            />
            {errors.orgNameEn && (
              <p className="text-[10px] text-destructive">
                {t('auth.error.org_name_en_required', 'English name is required')}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('auth.org.name_ar')}
            </label>
            <input
              type="text"
              placeholder="مثال: مؤسسة شبام للتراث"
              {...register('orgNameAr', { required: true })}
              className="w-full h-10 px-4 rounded-xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-xs font-medium text-slate-700"
            />
            {errors.orgNameAr && (
              <p className="text-[10px] text-destructive">
                {t('auth.error.org_name_ar_required', 'Arabic name is required')}
              </p>
            )}
          </div>
        </div>

        {/* Descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('auth.org.desc_en')}
            </label>
            <textarea
              rows={2}
              placeholder="Briefly describe your organization's mission..."
              {...register('descriptionEn')}
              className="w-full p-3 rounded-xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-xs font-medium text-slate-700 resize-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('auth.org.desc_ar')}
            </label>
            <textarea
              rows={2}
              placeholder="صف باختصار مهمة مؤسستك..."
              {...register('descriptionAr')}
              className="w-full p-3 rounded-xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-xs font-medium text-slate-700 resize-none"
            />
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('auth.org.address_en')}
            </label>
            <input
              type="text"
              placeholder="e.g. Main Street, Seiyun"
              {...register('addressEn', { required: true })}
              className="w-full h-10 px-4 rounded-xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-xs font-medium text-slate-700"
            />
            {errors.addressEn && (
              <p className="text-[10px] text-destructive">
                {t('auth.error.org_address_en_required', 'English address is required')}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('auth.org.address_ar')}
            </label>
            <input
              type="text"
              placeholder="مثال: الشارع الرئيسي، سيئون"
              {...register('addressAr', { required: true })}
              className="w-full h-10 px-4 rounded-xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-xs font-medium text-slate-700"
            />
            {errors.addressAr && (
              <p className="text-[10px] text-destructive">
                {t('auth.error.org_address_ar_required', 'Arabic address is required')}
              </p>
            )}
          </div>
        </div>

        {/* Google Maps URL */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('auth.org.map_url')}
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="https://maps.google.com/..."
              {...register('mapUrl')}
              className="w-full h-10 px-4 rounded-xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-xs font-medium text-slate-700"
            />
            <MapPin
              className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400`}
            />
          </div>
        </div>

        {/* Username & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('auth.org.username')}
            </label>
            <input
              type="text"
              placeholder="e.g. salem_hadrami"
              {...register('userName', { required: true })}
              className="w-full h-10 px-4 rounded-xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-xs font-medium text-slate-700"
            />
            {errors.userName && (
              <p className="text-[10px] text-destructive">
                {t('auth.error.username_required', 'Username is required')}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('auth.label.email')}
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              {...register('email', { required: true })}
              className="w-full h-10 px-4 rounded-xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-xs font-medium text-slate-700"
            />
            {errors.email && (
              <p className="text-[10px] text-destructive">{t('auth.error.email_required')}</p>
            )}
          </div>
        </div>

        {/* Phone & Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('auth.label.phone')}
            </label>
            <input
              type="tel"
              placeholder="+967..."
              {...register('phoneNumber')}
              className="w-full h-10 px-4 rounded-xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-xs font-medium text-slate-700"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('auth.label.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password', { required: true, minLength: 6 })}
                className="w-full h-10 px-4 rounded-xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-xs font-medium text-slate-700"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 cursor-pointer`}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[10px] text-destructive">{t('auth.error.password_required')}</p>
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {t('auth.label.confirm_password')}
          </label>
          <input
            type="password"
            placeholder="••••••••"
            {...register('confirmPassword', { required: true })}
            className="w-full h-10 px-4 rounded-xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-xs font-medium text-slate-700"
          />
        </div>

        {/* Agree Terms check */}
        <div className="flex items-start gap-2 py-1">
          <input
            type="checkbox"
            id="agreeTermsOrg"
            {...register('agreeTermsOrg', { required: true })}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0a5c66] focus:ring-[#0a5c66]"
          />
          <label
            htmlFor="agreeTermsOrg"
            className="text-xs text-slate-500 cursor-pointer select-none leading-relaxed"
          >
            {t('auth.label.agree_terms_org')}
          </label>
        </div>
        {errors.agreeTermsOrg && (
          <p className="text-xs text-destructive">{t('auth.error.agree_terms_required')}</p>
        )}

        {/* Submit button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 rounded-full bg-[#0a5c66] hover:bg-[#084951] text-white font-bold cursor-pointer transition-all flex items-center justify-center text-sm md:text-base"
        >
          {isLoading ? t('label.loading') : t('auth.org.button')}
        </Button>

        {/* Sign In Link */}
        <div className="text-center mt-2 text-sm text-slate-500 font-semibold">
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
