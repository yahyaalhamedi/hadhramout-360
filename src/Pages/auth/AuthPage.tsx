import { useState } from 'react'
import { useNavigate, useSearchParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle2 } from 'lucide-react'
import { useLogin, useRegisterUser, useRegisterOrganization } from '@/api/auth/useAuth'
import { useAuthContext } from '@/lib/AuthContext'
import { useGetRtl } from '@/lib/utils'
import type { LoginParams } from '@/api/auth/useAuth.types'

// Import Subcomponents and Types
import LoginForm from './components/LoginForm'
import UserRegisterForm, { type UserRegisterFormData } from './components/UserRegisterForm'
import OrgRegisterForm, { type OrgRegisterFormData } from './components/OrgRegisterForm'

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string
    }
  }
}

const BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=80'

export default function AuthPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isRtl = useGetRtl()
  const [searchParams, setSearchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'login' // 'login' | 'register' | 'register-org'

  const { isLoggedIn } = useAuthContext()

  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // API mutations
  const { mutate: loginMutation, isPending: loginIsPending } = useLogin()
  const { mutate: registerUserMutation, isPending: registerUserIsPending } = useRegisterUser()
  const { mutate: registerOrgMutation, isPending: registerOrgIsPending } = useRegisterOrganization()

  // ── Redirect if already logged in ────────────────────────────────
  if (isLoggedIn) {
    return <Navigate to="/" replace />
  }

  // ── 1. Handle Login Submit ──────────────────────────────────────
  const onLoginSubmit = (data: LoginParams, reset: () => void) => {
    setErrorMsg(null)
    setSuccessMsg(null)
    loginMutation(data, {
      onSuccess: () => {
        reset()
        navigate('/')
      },
      onError: (err) => {
        setErrorMsg((err as ApiErrorResponse).response?.data?.message || t('auth.login.error'))
      },
    })
  }

  // ── 2. Handle User Register Submit ──────────────────────────────
  const onUserRegisterSubmit = (data: UserRegisterFormData, reset: () => void) => {
    setErrorMsg(null)
    setSuccessMsg(null)
    if (data.password !== data.confirmPassword) {
      setErrorMsg(t('auth.error.password_match'))
      return
    }

    registerUserMutation(
      {
        userName: data.userName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber || undefined,
      },
      {
        onSuccess: () => {
          reset()
          setSuccessMsg(t('auth.success.registered'))
          setSearchParams({ mode: 'login' })
        },
        onError: (err) => {
          setErrorMsg((err as ApiErrorResponse).response?.data?.message || t('auth.error.generic'))
        },
      },
    )
  }

  // ── 3. Handle Organization Register Submit ──────────────────────
  const onOrgRegisterSubmit = (
    data: OrgRegisterFormData,
    logoFile: File | null,
    reset: () => void
  ) => {
    setErrorMsg(null)
    setSuccessMsg(null)
    if (data.password !== data.confirmPassword) {
      setErrorMsg(t('auth.error.password_match'))
      return
    }

    registerOrgMutation(
      {
        orgNameAr: data.orgNameAr,
        orgNameEn: data.orgNameEn,
        descriptionAr: data.descriptionAr || undefined,
        descriptionEn: data.descriptionEn || undefined,
        addressAr: data.addressAr,
        addressEn: data.addressEn,
        mapUrl: data.mapUrl || undefined,
        logoFile: logoFile,
        userName: data.userName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber || undefined,
      },
      {
        onSuccess: () => {
          reset()
          setSuccessMsg(t('auth.success.registered_org'))
          setSearchParams({ mode: 'login' })
        },
        onError: (err) => {
          setErrorMsg((err as ApiErrorResponse).response?.data?.message || t('auth.error.generic'))
        },
      },
    )
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[#171717] py-12 px-4 md:px-8 relative overflow-hidden"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Background with Dark Teal Tint overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={BACKGROUND_IMAGE}
          alt="Hadhramout Scenic"
          className="h-full w-full object-cover opacity-35 filter grayscale-[20%]"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0a2327]/90 via-[#102d31]/80 to-[#1c1c1c]/90 mix-blend-multiply" />
      </div>

      {/* Primary Container */}
      <div className="relative z-10 w-full max-w-lg mt-10">
        {/* Error or Success notification boxes */}
        {errorMsg && (
          <div className="mb-4 rounded-xl bg-destructive/15 text-white border border-destructive/20 p-4 text-sm text-destructive-foreground text-center">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-xl bg-emerald-500/15 border border-emerald-500/20 p-4 text-sm text-emerald-300 text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            {successMsg}
          </div>
        )}

        {/* Dynamic Form Render based on mode query param */}
        {mode === 'login' && (
          <LoginForm
            onSubmit={onLoginSubmit}
            isLoading={loginIsPending}
            onCreateAccountClick={() => setSearchParams({ mode: 'register' })}
            isRtl={isRtl}
          />
        )}

        {mode === 'register' && (
          <UserRegisterForm
            onSubmit={onUserRegisterSubmit}
            isLoading={registerUserIsPending}
            onSignInClick={() => setSearchParams({ mode: 'login' })}
            isRtl={isRtl}
          />
        )}

        {mode === 'register-org' && (
          <OrgRegisterForm
            onSubmit={onOrgRegisterSubmit}
            isLoading={registerOrgIsPending}
            onSignInClick={() => setSearchParams({ mode: 'login' })}
            isRtl={isRtl}
          />
        )}
      </div>
    </div>
  )
}
