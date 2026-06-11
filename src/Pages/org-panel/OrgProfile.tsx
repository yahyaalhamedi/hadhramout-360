import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { MapPin, LinkIcon, Mail, Phone, Upload, Pencil } from 'lucide-react'
import { useOrgProfile, useUpdateOrgProfile } from '@/api/organization/useOrganization'
import { baseURL } from '@/api/axiosInstance'
import { useGetRtl } from '@/lib/utils'

function getImageUrl(url: string | null) {
  if (!url) return undefined
  return url.startsWith('http') ? url : `${baseURL}${url}`
}

export default function OrgProfile() {
  const { t } = useTranslation()
  const isRtl = useGetRtl()
  const { data: profile, isLoading } = useOrgProfile()
  const updateMutation = useUpdateOrgProfile()
  const [isEditing, setIsEditing] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    orgNameAr: '',
    orgNameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    addressAr: '',
    addressEn: '',
    mapUrl: '',
    phoneNumber: '',
    email: '',
  })

  const openEdit = () => {
    if (profile) {
      setForm({
        orgNameAr: profile.orgNameAr ?? '',
        orgNameEn: profile.orgNameEn ?? '',
        descriptionAr: profile.descriptionAr ?? '',
        descriptionEn: profile.descriptionEn ?? '',
        addressAr: profile.addressAr ?? '',
        addressEn: profile.addressEn ?? '',
        mapUrl: profile.mapUrl ?? '',
        phoneNumber: profile.phoneNumber ?? '',
        email: profile.email ?? '',
      })
    }
    setLogoFile(null)
    setLogoPreview(null)
    setIsEditing(true)
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = () => {
    if (!form.orgNameAr || !form.orgNameEn || !form.addressAr || !form.addressEn) return

    updateMutation.mutate(
      {
        orgNameAr: form.orgNameAr,
        orgNameEn: form.orgNameEn,
        descriptionAr: form.descriptionAr,
        descriptionEn: form.descriptionEn,
        addressAr: form.addressAr,
        addressEn: form.addressEn,
        mapUrl: form.mapUrl || undefined,
        phoneNumber: form.phoneNumber || undefined,
        logoFile: logoFile ?? undefined,
      },
      {
        onSuccess: () => {
          setIsEditing(false)
          setLogoFile(null)
          setLogoPreview(null)
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-48 bg-slate-200 rounded" />
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100/80">
          <div className="flex gap-8">
            <div className="w-40 h-40 rounded-2xl bg-slate-200" />
            <div className="flex-1 space-y-4">
              <div className="h-5 w-64 bg-slate-200 rounded" />
              <div className="h-4 w-48 bg-slate-100 rounded" />
              <div className="h-4 w-40 bg-slate-100 rounded" />
              <div className="h-4 w-36 bg-slate-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isEditing) {
    return (
      <>
        <div className="flex items-center justify-between mb-8">
          <h2
            className="text-[40px] font-bold text-slate-900"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {t('org_panel.profile.title')}
          </h2>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100/80">
          {/* Logo Upload */}
          <div className="mb-8">
            <label className="block text-[13px] font-semibold text-[#0a5c66] mb-3">
              {t('org_panel.profile.logo')}
            </label>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              className="w-full h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer"
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Preview" className="h-20 rounded-lg object-cover" />
              ) : profile?.logoUrl ? (
                <img src={getImageUrl(profile.logoUrl)} alt="Current logo" className="h-20 rounded-lg object-cover" />
              ) : (
                <>
                  <Upload className="h-8 w-8" />
                  <span className="text-[13px]">
                    {t('org_panel.profile.upload_hint')}
                  </span>
                  <span className="text-[11px] text-slate-400">{t('org_panel.profile.upload_desc')}</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-5">
            {/* Org Names */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#0a5c66] mb-1.5">
                  {t('org_panel.profile.name_en')}
                </label>
                <input
                  value={form.orgNameEn}
                  onChange={(e) => setForm((p) => ({ ...p, orgNameEn: e.target.value }))}
                  placeholder="e.g. Shibam Heritage Trust"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#0a5c66] mb-1.5">
                  {t('org_panel.profile.name_ar')}
                </label>
                <input
                  value={form.orgNameAr}
                  onChange={(e) => setForm((p) => ({ ...p, orgNameAr: e.target.value }))}
                  placeholder="مثال: مؤسسة شيبام التراثية"
                  dir="rtl"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#0a5c66] mb-1.5">
                  {t('org_panel.profile.desc_en')}
                </label>
                <textarea
                  value={form.descriptionEn}
                  onChange={(e) => setForm((p) => ({ ...p, descriptionEn: e.target.value }))}
                  rows={3}
                  placeholder={t('org_panel.profile.desc_en_placeholder')}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 resize-none bg-[#f8f9fa]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#0a5c66] mb-1.5">
                  {t('org_panel.profile.desc_ar')}
                </label>
                <textarea
                  value={form.descriptionAr}
                  onChange={(e) => setForm((p) => ({ ...p, descriptionAr: e.target.value }))}
                  rows={3}
                  placeholder={t('org_panel.profile.desc_ar_placeholder')}
                  dir="rtl"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 resize-none bg-[#f8f9fa]"
                />
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#0a5c66] mb-1.5">
                  {t('org_panel.profile.address_en')}
                </label>
                <input
                  value={form.addressEn}
                  onChange={(e) => setForm((p) => ({ ...p, addressEn: e.target.value }))}
                  placeholder="e.g. Main Street, Seiyun"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#0a5c66] mb-1.5">
                  {t('org_panel.profile.address_ar')}
                </label>
                <input
                  value={form.addressAr}
                  onChange={(e) => setForm((p) => ({ ...p, addressAr: e.target.value }))}
                  placeholder="مثال:شارع الشارع الرئيسي، سيئون"
                  dir="rtl"
                  className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
                />
              </div>
            </div>

            {/* Map URL */}
            <div>
              <label className="block text-[13px] font-semibold text-[#0a5c66] mb-1.5">
                {t('org_panel.profile.map_url')}
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  value={form.mapUrl}
                  onChange={(e) => setForm((p) => ({ ...p, mapUrl: e.target.value }))}
                  placeholder="https://maps.google.com/..."
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[13px] font-semibold text-[#0a5c66] mb-1.5">
                {t('org_panel.profile.email')}
              </label>
              <input
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                placeholder="name@example.com"
                type="email"
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-[13px] font-semibold text-[#0a5c66] mb-1.5">
                {t('org_panel.profile.phone')}
              </label>
              <input
                value={form.phoneNumber}
                onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                placeholder="+967..."
                className="w-full h-11 px-4 rounded-xl border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 bg-[#f8f9fa]"
              />
            </div>

          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <button
              onClick={handleSubmit}
              disabled={updateMutation.isPending}
              className="w-full h-12 rounded-xl bg-[#0a5c66] text-white text-[14px] font-medium hover:bg-[#094d55] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {updateMutation.isPending ? t('org_panel.profile.saving') : t('org_panel.profile.save')}
            </button>
            <button
              onClick={() => {
                setIsEditing(false)
                setLogoFile(null)
                setLogoPreview(null)
              }}
              className="w-full h-12 rounded-xl border border-slate-200 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {t('org_panel.profile.cancel')}
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-[40px] font-bold text-slate-900"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          {t('org_panel.profile.title')}
        </h2>
        <button
          onClick={openEdit}
          className="bg-[#0a5c66] text-white px-6 py-3 rounded-xl text-[14px] font-medium hover:bg-[#094d55] transition-colors cursor-pointer flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          {t('org_panel.profile.edit')}
        </button>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100/80">
        <div className="flex gap-8">
          {/* Logo */}
          <div className="w-40 h-40 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
            {profile?.logoUrl ? (
              <img
                src={getImageUrl(profile.logoUrl)}
                alt={isRtl ? (profile.orgNameAr ?? '') : (profile.orgNameEn ?? '')}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                {t('org_panel.profile.no_logo')}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="space-y-3 mb-6">
              {(isRtl ? profile?.addressAr : profile?.addressEn) && (
                <div className="flex items-center gap-3 text-[14px] text-slate-600">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  <span>{isRtl ? profile?.addressAr : profile?.addressEn}</span>
                </div>
              )}
              {profile?.mapUrl && (
                <div className="flex items-center gap-3 text-[14px] text-slate-600">
                  <LinkIcon className="h-4 w-4 text-slate-400" />
                  <a
                    href={profile.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#0a5c66] hover:underline"
                  >
                    {profile.mapUrl}
                  </a>
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-3 text-[14px] text-slate-600">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile?.phoneNumber && (
                <div className="flex items-center gap-3 text-[14px] text-slate-600">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <span>{profile.phoneNumber}</span>
                </div>
              )}
            </div>

            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              {isRtl
                ? (profile?.orgNameAr || profile?.orgNameEn || 'Organization')
                : (profile?.orgNameEn || profile?.orgNameAr || 'Organization')}
            </h3>

            {(isRtl ? profile?.descriptionAr : profile?.descriptionEn) && (
              <p className="text-[14px] text-slate-600 leading-relaxed max-w-2xl">
                {isRtl ? profile?.descriptionAr : profile?.descriptionEn}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
