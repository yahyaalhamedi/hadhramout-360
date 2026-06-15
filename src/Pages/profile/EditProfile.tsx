import { useState, useRef, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  Camera,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Mail,
  Lock,
  User,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  useProfile,
  useUpdateProfile,
  useChangeEmail,
  useChangePassword,
  useDeleteProfileImage,
} from '@/api/account/useAccount'
import { useGetRtl } from '@/lib/utils'
import { baseURL } from '@/api/axiosInstance'

// ── Types ────────────────────────────────────────────────────────────

interface ProfileFormData {
  fullName: string
  phoneNumber: string
}

interface EmailFormData {
  newEmail: string
  currentPassword: string
}

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

type Tab = 'profile' | 'email' | 'password'

// ── Constants ────────────────────────────────────────────────────────

const FALLBACK_AVATAR = '/profile.png'

const BG_IMAGE =
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80'

const INPUT_CLS =
  'w-full h-12 px-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#096866]/40 focus-visible:border-[#096866]/40 text-sm font-medium text-slate-700 placeholder:text-slate-400 transition-all duration-200'

const LABEL_CLS = 'text-xs font-bold uppercase tracking-wider text-slate-500'

const ERROR_CLS = 'text-xs text-red-500 mt-1'

// ── Component ────────────────────────────────────────────────────────

export default function EditProfile() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isRtl = useGetRtl()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: profile, isLoading: profileLoading } = useProfile()
  const { mutate: updateProfile, isPending: updatingProfile } = useUpdateProfile()
  const { mutate: changeEmail, isPending: changingEmail } = useChangeEmail()
  const { mutate: changePassword, isPending: changingPassword } = useChangePassword()
  const { mutate: deleteProfileImage, isPending: deletingImage } = useDeleteProfileImage()

  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Forms
  const profileForm = useForm<ProfileFormData>({
    defaultValues: { fullName: '', phoneNumber: '' },
  })
  const emailForm = useForm<EmailFormData>({
    defaultValues: { newEmail: '', currentPassword: '' },
  })
  const passwordForm = useForm<PasswordFormData>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  // Sync form with fetched profile data
  useEffect(() => {
    if (profile) {
      profileForm.reset({
        fullName: profile.fullName ?? '',
        phoneNumber: profile.phoneNumber ?? '',
      })
    }
  }, [profile, profileForm])

  // ── Handlers ─────────────────────────────────────────────────────

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDeleteImage = () => {
    deleteProfileImage(undefined, {
      onSuccess: () => {
        setPreviewUrl(null)
        setSelectedFile(null)
        toast.success(t('profile.image_deleted'))
      },
    })
  }

  const onProfileSubmit = (data: ProfileFormData) => {
    updateProfile(
      {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        profileImageFile: selectedFile ?? undefined,
      },
      {
        onSuccess: () => toast.success(t('profile.update_success')),
      },
    )
  }

  const onEmailSubmit = (data: EmailFormData) => {
    changeEmail(
      { newEmail: data.newEmail, currentPassword: data.currentPassword },
      {
        onSuccess: () => {
          toast.success(t('profile.email_updated'))
          emailForm.reset({ newEmail: '', currentPassword: '' })
        },
      },
    )
  }

  const onPasswordSubmit = (data: PasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error(t('auth.error.password_match'))
      return
    }
    changePassword(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          toast.success(t('profile.password_updated'))
          passwordForm.reset({ currentPassword: '', newPassword: '', confirmPassword: '' })
        },
      },
    )
  }

  // ── Loading state ────────────────────────────────────────────────

  if (profileLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#171717] relative">
        <div className="absolute inset-0 z-0">
          <img src={BG_IMAGE} alt="" className="h-full w-full object-cover opacity-35 filter grayscale-[20%]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0a2327]/90 via-[#102d31]/80 to-[#1c1c1c]/90 mix-blend-multiply" />
        </div>
        <div className="relative z-10">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-[#096866]/20 animate-ping" />
            <Loader2 className="h-10 w-10 animate-spin text-[#096866] relative" />
          </div>
          <p className="text-sm text-white/50 mt-4 font-medium text-center">{t('label.loading', 'Loading...')}</p>
        </div>
      </div>
    )
  }

  // ── Derived ──────────────────────────────────────────────────────

  const avatarSrc =
    previewUrl ??
    (profile?.profileImageUrl ? `${baseURL}${profile.profileImageUrl}` : FALLBACK_AVATAR)

  const hasImage = !!profile?.profileImageUrl || !!previewUrl

  const tabs: { key: Tab; label: string; icon: ReactNode }[] = [
    { key: 'profile', label: t('profile.info'), icon: <User className="h-4 w-4" /> },
    { key: 'email', label: t('profile.change_email'), icon: <Mail className="h-4 w-4" /> },
    { key: 'password', label: t('profile.change_password'), icon: <Lock className="h-4 w-4" /> },
  ]

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[#171717] py-8 px-4 relative overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* ── Background: scenic image + dark overlay (same as login) ── */}
      <div className="absolute inset-0 z-0">
        <img
          src={BG_IMAGE}
          alt=""
          className="h-full w-full object-cover opacity-35 filter grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a2327]/90 via-[#102d31]/80 to-[#1c1c1c]/90 mix-blend-multiply" />
      </div>

      {/* ── Animated floating particles ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Large slow-orbit ring */}
        <div className="absolute top-[15%] left-[10%] w-[300px] h-[300px] rounded-full border border-white/[0.04] animate-[spin_40s_linear_infinite]" />
        <div className="absolute bottom-[10%] right-[5%] w-[250px] h-[250px] rounded-full border border-white/[0.03] animate-[spin_50s_linear_infinite_reverse]" />

        {/* Floating dots */}
        <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-[#096866]/30 animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute top-[60%] right-[20%] w-2 h-2 rounded-full bg-[#cea46c]/25 animate-[float_8s_ease-in-out_infinite_1s]" />
        <div className="absolute top-[40%] left-[60%] w-1 h-1 rounded-full bg-white/20 animate-[float_7s_ease-in-out_infinite_2s]" />
        <div className="absolute bottom-[25%] left-[30%] w-1.5 h-1.5 rounded-full bg-[#096866]/20 animate-[float_9s_ease-in-out_infinite_0.5s]" />
        <div className="absolute top-[70%] right-[40%] w-1 h-1 rounded-full bg-white/15 animate-[float_6.5s_ease-in-out_infinite_3s]" />
        <div className="absolute top-[30%] right-[10%] w-2 h-2 rounded-full bg-[#cea46c]/15 animate-[float_7.5s_ease-in-out_infinite_1.5s]" />

        {/* Breathing glow orbs */}
        <div className="absolute top-[25%] left-[50%] -translate-x-1/2 w-[400px] h-[200px] rounded-full bg-[#096866]/[0.04] blur-[80px] animate-[breathe_5s_ease-in-out_infinite]" />
        <div className="absolute bottom-[20%] left-[20%] w-[300px] h-[300px] rounded-full bg-[#cea46c]/[0.03] blur-[100px] animate-[breathe_7s_ease-in-out_infinite_2s]" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-[460px]">
        <div className="bg-white rounded-[32px] shadow-[0_4px_60px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden">
          {/* ─── Header / Avatar ─── */}
          <div className="relative overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#096866] via-[#0a7d7a] to-[#084f57]">
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(206,164,108,0.2) 0%, transparent 40%), radial-gradient(circle at 60% 80%, rgba(255,255,255,0.1) 0%, transparent 40%)',
              }} />
              {/* Floating decorative circles */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full border border-white/10 animate-[spin_20s_linear_infinite]" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 rounded-full border border-white/5 animate-[spin_30s_linear_infinite_reverse]" />
              <div className="absolute top-6 right-16 w-3 h-3 rounded-full bg-white/20 animate-pulse" />
              <div className="absolute bottom-10 left-8 w-2 h-2 rounded-full bg-[#cea46c]/40 animate-pulse delay-1000" />
            </div>

            <div className="relative pt-10 pb-14 px-8 text-center">
              {/* Avatar */}
              <div className="relative inline-block group">
                {/* Glow ring behind avatar */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-white/30 to-[#cea46c]/30 blur-sm" />
                <img
                  src={avatarSrc}
                  alt={profile?.fullName ?? 'User'}
                  className="relative w-[112px] h-[112px] rounded-full object-cover border-[3px] border-white shadow-xl mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
                />
                {/* Camera button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0.5 right-0.5 bg-white hover:bg-slate-50 text-[#096866] rounded-full p-2.5 shadow-lg cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95"
                  title={t('profile.change_photo')}
                >
                  <Camera className="h-4 w-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {/* Remove button */}
                {hasImage && !previewUrl && (
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    disabled={deletingImage}
                    className="absolute top-0.5 right-0.5 bg-white hover:bg-red-50 text-red-500 rounded-full p-2 shadow-lg cursor-pointer transition-all duration-200 hover:scale-110 disabled:opacity-50"
                    title={t('profile.remove_image')}
                  >
                    {deletingImage ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                  </button>
                )}
              </div>

              {/* Name + email */}
              <h1
                className="text-white text-xl font-bold mt-5 drop-shadow-sm"
                style={{ fontFamily: isRtl ? "'Thmanyah', serif" : 'inherit' }}
              >
                {profile?.fullName || 'User'}
              </h1>
              <p className="text-white/60 text-sm mt-1 font-medium">{profile?.email}</p>
            </div>
          </div>

          {/* ─── Tabs ─── */}
          <div className="flex border-b border-slate-100 bg-slate-50/50">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3.5 text-xs font-semibold transition-all duration-200 cursor-pointer relative
                  ${activeTab === tab.key
                    ? 'text-[#096866] bg-white'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                  }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-gradient-to-r from-[#096866] to-[#0a7d7a] rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* ─── Tab Content ─── */}
          <div className="p-6 sm:p-8 min-h-[280px]">
            {activeTab === 'profile' && (
              <ProfileTab
                form={profileForm}
                onSubmit={onProfileSubmit}
                isLoading={updatingProfile}
                t={t}
              />
            )}
            {activeTab === 'email' && (
              <EmailTab
                form={emailForm}
                onSubmit={onEmailSubmit}
                isLoading={changingEmail}
                currentEmail={profile?.email}
                t={t}
              />
            )}
            {activeTab === 'password' && (
              <PasswordTab
                form={passwordForm}
                onSubmit={onPasswordSubmit}
                isLoading={changingPassword}
                t={t}
              />
            )}
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-[#096866] cursor-pointer transition-colors duration-200"
          >
            {t('label.back')}
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Tab: Profile ─────────────────────────────────────────────────────

function ProfileTab({
  form,
  onSubmit,
  isLoading,
  t,
}: {
  form: ReturnType<typeof useForm<ProfileFormData>>
  onSubmit: (data: ProfileFormData) => void
  isLoading: boolean
  t: (key: string) => string
}) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
      <div className="space-y-1.5">
        <label className={LABEL_CLS}>{t('auth.label.fullname')}</label>
        <input
          type="text"
          {...form.register('fullName', { required: true })}
          className={INPUT_CLS}
        />
        {form.formState.errors.fullName && (
          <p className={ERROR_CLS}>{t('auth.error.fullname_required')}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className={LABEL_CLS}>{t('auth.label.phone')}</label>
        <input
          type="tel"
          {...form.register('phoneNumber')}
          className={INPUT_CLS}
          placeholder={t('auth.label.phone')}
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#096866] to-[#0a7d7a] hover:from-[#084f57] hover:to-[#096866] text-white font-bold cursor-pointer transition-all duration-200 flex items-center justify-center text-sm mt-3 shadow-md shadow-[#096866]/20 hover:shadow-lg hover:shadow-[#096866]/30 hover:-translate-y-0.5 active:translate-y-0"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('profile.save')}
      </Button>
    </form>
  )
}

// ── Tab: Email ───────────────────────────────────────────────────────

function EmailTab({
  form,
  onSubmit,
  isLoading,
  currentEmail,
  t,
}: {
  form: ReturnType<typeof useForm<EmailFormData>>
  onSubmit: (data: EmailFormData) => void
  isLoading: boolean
  currentEmail?: string
  t: (key: string) => string
}) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
      {/* Current email badge */}
      <div className="bg-gradient-to-r from-[#096866]/5 to-[#096866]/10 rounded-2xl px-4 py-3.5 flex items-center gap-3 border border-[#096866]/10">
        <div className="bg-[#096866]/10 text-[#096866] rounded-xl p-2.5">
          <Mail className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#096866]/60">
            {t('profile.current_email')}
          </p>
          <p className="text-sm font-semibold text-[#096866] truncate">{currentEmail}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={LABEL_CLS}>{t('profile.new_email')}</label>
        <input
          type="email"
          placeholder="name@example.com"
          {...form.register('newEmail', { required: true })}
          className={INPUT_CLS}
        />
        {form.formState.errors.newEmail && (
          <p className={ERROR_CLS}>{t('auth.error.email_required')}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className={LABEL_CLS}>{t('profile.current_password')}</label>
        <input
          type="password"
          placeholder="••••••••"
          {...form.register('currentPassword', { required: true })}
          className={INPUT_CLS}
        />
        {form.formState.errors.currentPassword && (
          <p className={ERROR_CLS}>{t('auth.error.password_required')}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#096866] to-[#0a7d7a] hover:from-[#084f57] hover:to-[#096866] text-white font-bold cursor-pointer transition-all duration-200 flex items-center justify-center text-sm mt-3 shadow-md shadow-[#096866]/20 hover:shadow-lg hover:shadow-[#096866]/30 hover:-translate-y-0.5 active:translate-y-0"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('profile.update_email')}
      </Button>
    </form>
  )
}

// ── Tab: Password ────────────────────────────────────────────────────

function PasswordTab({
  form,
  onSubmit,
  isLoading,
  t,
}: {
  form: ReturnType<typeof useForm<PasswordFormData>>
  onSubmit: (data: PasswordFormData) => void
  isLoading: boolean
  t: (key: string) => string
}) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
      <div className="space-y-1.5">
        <label className={LABEL_CLS}>{t('profile.current_password')}</label>
        <input
          type="password"
          placeholder="••••••••"
          {...form.register('currentPassword', { required: true })}
          className={INPUT_CLS}
        />
        {form.formState.errors.currentPassword && (
          <p className={ERROR_CLS}>{t('auth.error.password_required')}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className={LABEL_CLS}>{t('profile.new_password')}</label>
        <input
          type="password"
          placeholder="••••••••"
          {...form.register('newPassword', {
            required: true,
            minLength: { value: 6, message: 'Min 6 characters' },
          })}
          className={INPUT_CLS}
        />
        {form.formState.errors.newPassword && (
          <p className={ERROR_CLS}>{form.formState.errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label className={LABEL_CLS}>{t('auth.label.confirm_password')}</label>
        <input
          type="password"
          placeholder="••••••••"
          {...form.register('confirmPassword', { required: true })}
          className={INPUT_CLS}
        />
        {form.formState.errors.confirmPassword && (
          <p className={ERROR_CLS}>{t('auth.error.password_required')}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#096866] to-[#0a7d7a] hover:from-[#084f57] hover:to-[#096866] text-white font-bold cursor-pointer transition-all duration-200 flex items-center justify-center text-sm mt-3 shadow-md shadow-[#096866]/20 hover:shadow-lg hover:shadow-[#096866]/30 hover:-translate-y-0.5 active:translate-y-0"
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : t('profile.update_password')}
      </Button>
    </form>
  )
}
