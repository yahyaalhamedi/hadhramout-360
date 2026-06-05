import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  Camera,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
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

const BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80'

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

  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const profileForm = useForm<ProfileFormData>({
    defaultValues: {
      fullName: profile?.fullName ?? '',
      phoneNumber: profile?.phoneNumber ?? '',
    },
  })

  const emailForm = useForm<EmailFormData>({
    defaultValues: { newEmail: '', currentPassword: '' },
  })

  const passwordForm = useForm<PasswordFormData>({
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleDeleteImage = () => {
    setProfileMsg(null)
    deleteProfileImage(undefined, {
      onSuccess: () => {
        setPreviewUrl(null)
        setSelectedFile(null)
        setProfileMsg({ type: 'success', text: t('profile.image_deleted', 'Profile image removed.') })
      },
      onError: (err: Error) => {
        const apiErr = err as Error & { response?: { data?: { message?: string } } }
        setProfileMsg({ type: 'error', text: apiErr.response?.data?.message || t('profile.update_error') })
      },
    })
  }

  const onProfileSubmit = (data: ProfileFormData) => {
    setProfileMsg(null)
    updateProfile(
      {
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        profileImageFile: selectedFile ?? undefined,
      },
      {
        onSuccess: () => {
          setProfileMsg({ type: 'success', text: t('profile.update_success') })
        },
        onError: (err: Error) => {
          const apiErr = err as Error & { response?: { data?: { message?: string } } }
          setProfileMsg({ type: 'error', text: apiErr.response?.data?.message || t('profile.update_error') })
        },
      },
    )
  }

  const onEmailSubmit = (data: EmailFormData, reset: () => void) => {
    setEmailMsg(null)
    changeEmail(
      { newEmail: data.newEmail, currentPassword: data.currentPassword },
      {
        onSuccess: () => {
          setEmailMsg({ type: 'success', text: t('profile.email_updated', 'Email changed successfully!') })
          reset()
        },
        onError: (err: Error) => {
          const apiErr = err as Error & { response?: { data?: { message?: string } } }
          setEmailMsg({ type: 'error', text: apiErr.response?.data?.message || t('profile.email_error', 'Failed to change email.') })
        },
      },
    )
  }

  const onPasswordSubmit = (data: PasswordFormData, reset: () => void) => {
    setPasswordMsg(null)
    if (data.newPassword !== data.confirmPassword) {
      setPasswordMsg({ type: 'error', text: t('auth.error.password_match') })
      return
    }
    changePassword(
      { currentPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          setPasswordMsg({ type: 'success', text: t('profile.password_updated', 'Password changed successfully!') })
          reset()
        },
        onError: (err: Error) => {
          const apiErr = err as Error & { response?: { data?: { message?: string } } }
          setPasswordMsg({ type: 'error', text: apiErr.response?.data?.message || t('profile.password_error', 'Failed to change password.') })
        },
      },
    )
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#171717]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0a5c66]" />
      </div>
    )
  }

  const avatarSrc =
    previewUrl ??
    (profile?.profileImageUrl
      ? `${baseURL}${profile.profileImageUrl}`
      : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80')

  const inputCls =
    'w-full h-12 px-4 rounded-2xl bg-slate-50 border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-7 text-sm font-medium text-slate-700'

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[#171717] py-12 px-4 md:px-8 relative overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 z-0">
        <img
          src={BACKGROUND_IMAGE}
          alt="Hadhramout Scenic"
          className="h-full w-full object-cover opacity-35 filter grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a2327]/90 via-[#102d31]/80 to-[#1c1c1c]/90 mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-lg mt-10 space-y-6">
        {/* ─── Section 1: Profile Info ─── */}
        <div className="w-full bg-white rounded-[32px] p-8 shadow-2xl">
          <h2
            className="text-2xl font-bold text-slate-800 text-center mb-8 flex items-center justify-center gap-2"
            style={{ fontFamily: isRtl ? "'Thmanyah', serif" : 'inherit' }}
          >
            <User className="h-6 w-6 text-[#0a5c66]" />
            {t('profile.info', 'Profile Information')}
          </h2>

          {profileMsg && (
            <MsgBanner msg={profileMsg} />
          )}

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-3">
              <img
                src={avatarSrc}
                alt={profile?.fullName ?? 'User'}
                className="w-[100px] h-[100px] rounded-full object-cover border-2 border-white shadow-md"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-[#0a5c66] hover:bg-[#084951] text-white rounded-full p-2 cursor-pointer transition-colors"
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
            </div>
            {profile?.profileImageUrl && !previewUrl && (
              <button
                type="button"
                onClick={handleDeleteImage}
                disabled={deletingImage}
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-600 cursor-pointer transition-colors disabled:opacity-50"
              >
                {deletingImage ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                {t('profile.remove_image', 'Remove photo')}
              </button>
            )}
          </div>

          <form
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
            className="space-y-5"
            autoComplete="off"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('auth.label.fullname')}
              </label>
              <input
                type="text"
                {...profileForm.register('fullName', { required: true })}
                className={inputCls}
              />
              {profileForm.formState.errors.fullName && (
                <p className="text-xs text-destructive">{t('auth.error.fullname_required')}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('auth.label.phone')}
              </label>
              <input
                type="tel"
                {...profileForm.register('phoneNumber')}
                className={inputCls}
              />
            </div>

            <Button
              type="submit"
              disabled={updatingProfile}
              className="w-full h-14 rounded-full bg-[#0a5c66] hover:bg-[#084951] text-white font-bold cursor-pointer transition-all flex items-center justify-center text-base"
            >
              {updatingProfile ? <Loader2 className="h-5 w-5 animate-spin" /> : t('profile.save')}
            </Button>
          </form>
        </div>

        {/* ─── Section 2: Change Email ─── */}
        <div className="w-full bg-white rounded-[32px] p-8 shadow-2xl">
          <h2
            className="text-xl font-bold text-slate-800 text-center mb-6 flex items-center justify-center gap-2"
            style={{ fontFamily: isRtl ? "'Thmanyah', serif" : 'inherit' }}
          >
            <Mail className="h-5 w-5 text-[#0a5c66]" />
            {t('profile.change_email', 'Change Email')}
          </h2>

          {emailMsg && (
            <MsgBanner msg={emailMsg} />
          )}

          <p className="text-xs text-slate-400 text-center mb-5">
            {t('profile.email_hint', 'Current email: {{email}}', { email: profile?.email })}
          </p>

          <form
            onSubmit={emailForm.handleSubmit((data) => {
              onEmailSubmit(data, () => emailForm.reset({ newEmail: '', currentPassword: '' }))
            })}
            className="space-y-5"
            autoComplete="off"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('profile.new_email', 'New Email')}
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                {...emailForm.register('newEmail', { required: true })}
                className={inputCls}
              />
              {emailForm.formState.errors.newEmail && (
                <p className="text-xs text-destructive">{t('auth.error.email_required')}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('profile.current_password', 'Current Password')}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...emailForm.register('currentPassword', { required: true })}
                className={inputCls}
              />
              {emailForm.formState.errors.currentPassword && (
                <p className="text-xs text-destructive">{t('auth.error.password_required')}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={changingEmail}
              variant="outline"
              className="w-full h-12 rounded-full border-[#0a5c66] text-[#0a5c66] hover:bg-[#0a5c66]/5 font-bold cursor-pointer transition-all flex items-center justify-center"
            >
              {changingEmail ? <Loader2 className="h-5 w-5 animate-spin" /> : t('profile.update_email', 'Update Email')}
            </Button>
          </form>
        </div>

        {/* ─── Section 3: Change Password ─── */}
        <div className="w-full bg-white rounded-[32px] p-8 shadow-2xl">
          <h2
            className="text-xl font-bold text-slate-800 text-center mb-6 flex items-center justify-center gap-2"
            style={{ fontFamily: isRtl ? "'Thmanyah', serif" : 'inherit' }}
          >
            <Lock className="h-5 w-5 text-[#0a5c66]" />
            {t('profile.change_password', 'Change Password')}
          </h2>

          {passwordMsg && (
            <MsgBanner msg={passwordMsg} />
          )}

          <form
            onSubmit={passwordForm.handleSubmit((data) => {
              onPasswordSubmit(data, () => passwordForm.reset({ currentPassword: '', newPassword: '', confirmPassword: '' }))
            })}
            className="space-y-5"
            autoComplete="off"
          >
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('profile.current_password')}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...passwordForm.register('currentPassword', { required: true })}
                className={inputCls}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-xs text-destructive">{t('auth.error.password_required')}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('profile.new_password', 'New Password')}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...passwordForm.register('newPassword', {
                  required: true,
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
                className={inputCls}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t('auth.label.confirm_password')}
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...passwordForm.register('confirmPassword', { required: true })}
                className={inputCls}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">{t('auth.error.password_required')}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={changingPassword}
              variant="outline"
              className="w-full h-12 rounded-full border-[#0a5c66] text-[#0a5c66] hover:bg-[#0a5c66]/5 font-bold cursor-pointer transition-all flex items-center justify-center"
            >
              {changingPassword ? <Loader2 className="h-5 w-5 animate-spin" /> : t('profile.update_password', 'Update Password')}
            </Button>
          </form>
        </div>

        {/* ─── Back Link ─── */}
        <div className="text-center pb-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-white/70 hover:text-white cursor-pointer transition-colors"
          >
            {t('label.back')}
            {isRtl ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Reusable banner ──────────────────────────────────────────────────
function MsgBanner({ msg }: { msg: { type: 'success' | 'error'; text: string } }) {
  if (msg.type === 'success') {
    return (
      <div className="mb-5 rounded-xl bg-emerald-500/15 border border-emerald-500/20 p-3 text-sm text-emerald-600 text-center flex items-center justify-center gap-2">
        <CheckCircle2 className="h-4 w-4" />
        {msg.text}
      </div>
    )
  }
  return (
    <div className="mb-5 rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600 text-center">
      {msg.text}
    </div>
  )
}
