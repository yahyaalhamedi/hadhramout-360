import { useState, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Trash2, X, Upload } from 'lucide-react'
import { useAdminUsers, useDeleteUser, useCreateContentManager } from '@/api/admin/useAdminUsers'
import type { AdminUser } from '@/api/admin/useAdminUsers.types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { baseURL } from '@/api/axiosInstance'

const roleBadgeStyles: Record<string, string> = {
  Admin: 'bg-teal-700 text-white',
  ContentManager: 'bg-slate-200 text-slate-700',
  Organization: 'bg-amber-100 text-amber-700',
  User: 'bg-slate-100 text-slate-600',
}

function getRoleBadgeStyle(role: string) {
  return roleBadgeStyles[role] ?? 'bg-slate-100 text-slate-600'
}

function getInitials(name: string | null) {
  if (!name) return '?'
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getProfileImage(url: string | null) {
  if (!url) return undefined
  return url.startsWith('http') ? url : `${baseURL}${url}`
}

export default function Users() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [showRoleDropdown, setShowRoleDropdown] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [createForm, setCreateForm] = useState({ fullName: '', email: '', password: '', phoneNumber: '' })
  const [createProfileImage, setCreateProfileImage] = useState<File | null>(null)
  const createFileInputRef = useRef<HTMLInputElement>(null)
  const [activeFilters, setActiveFilters] = useState<{ type: 'search' | 'role'; value: string }[]>([])

  const ROLE_OPTIONS = [t('dashboard.users.all_roles'), 'Admin', 'ContentManager', 'Organization', 'User'] as const

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useAdminUsers({
    search: search || undefined,
    role: roleFilter || undefined,
    pageSize: 10,
  })

  const deleteMutation = useDeleteUser()
  const createMutation = useCreateContentManager()

  const users = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? []
  }, [data])

  const totalCount = data?.pages[0]?.pagination.totalEntries ?? 0

  const handleSearch = (value: string) => {
    setSearch(value)
    setActiveFilters((prev) => {
      const withoutSearch = prev.filter((f) => f.type !== 'search')
      if (value.trim()) return [...withoutSearch, { type: 'search', value: value.trim() }]
      return withoutSearch
    })
  }

  const handleRoleFilter = (role: string) => {
    const allRolesLabel = t('dashboard.users.all_roles')
    const actualRole = role === allRolesLabel ? '' : role
    setRoleFilter(actualRole)
    setShowRoleDropdown(false)
    setActiveFilters((prev) => {
      const withoutRole = prev.filter((f) => f.type !== 'role')
      if (actualRole) return [...withoutRole, { type: 'role', value: role }]
      return withoutRole
    })
  }

  const removeFilter = (filter: { type: 'search' | 'role'; value: string }) => {
    setActiveFilters((prev) => prev.filter((f) => !(f.type === filter.type && f.value === filter.value)))
    if (filter.type === 'search') setSearch('')
    if (filter.type === 'role') setRoleFilter('')
  }

  const clearFilters = () => {
    setActiveFilters([])
    setSearch('')
    setRoleFilter('')
  }

  const handleDelete = (userId: number) => {
    if (!confirm(t('dashboard.users.delete_confirm'))) return
    deleteMutation.mutate(userId)
  }

  const handleCreate = () => {
    if (!createForm.fullName || !createForm.email || !createForm.password) return
    createMutation.mutate({
      ...createForm,
      profileImageFile: createProfileImage ?? undefined,
    }, {
      onSuccess: () => {
        setShowCreateModal(false)
        setCreateForm({ fullName: '', email: '', password: '', phoneNumber: '' })
        setCreateProfileImage(null)
      },
    })
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[40px] font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
          {t('dashboard.users.title')}
        </h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#0a5c66] text-white px-6 py-3 rounded-xl text-[14px] font-medium hover:bg-[#094d55] transition-colors cursor-pointer"
        >
          {t('dashboard.users.new_cm')}
        </button>
      </div>

      {/* Search & Role Filter */}
      <div className="flex items-center gap-4 mb-5">
        <div className="relative flex-1">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder={t('dashboard.users.search')}
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full h-12 pl-5 pr-12 rounded-xl border border-slate-200 bg-white text-[14px] text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20 transition-all"
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className="h-12 px-5 rounded-xl border border-slate-200 bg-white text-[14px] font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-2 min-w-[140px] justify-between"
          >
            {roleFilter || t('dashboard.users.all_roles')}
            <svg className={`h-4 w-4 text-slate-400 transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
            </svg>
          </button>
          {showRoleDropdown && (
            <div className="absolute top-full mt-1 right-0 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
              {ROLE_OPTIONS.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleFilter(role)}
                  className={`w-full text-left px-4 py-2.5 text-[13px] hover:bg-slate-50 cursor-pointer transition-colors ${
                    (roleFilter === '' && role === t('dashboard.users.all_roles')) || roleFilter === role
                      ? 'bg-[#eaf4f5] text-[#0a5c66] font-medium'
                      : 'text-slate-600'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">
            {t('dashboard.users.active_filters')}
          </span>
          {activeFilters.map((f) => (
            <span
              key={`${f.type}-${f.value}`}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-[12px] font-medium"
            >
              {f.value}
              <button onClick={() => removeFilter(f)} className="cursor-pointer hover:text-amber-900">
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            onClick={clearFilters}
            className="text-[13px] font-medium text-[#0a5c66] underline hover:text-[#094d55] cursor-pointer"
          >
            {t('dashboard.users.clear_filters')}
          </button>
        </div>
      )}

      {/* User List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-slate-100/80 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div className="h-4 w-40 bg-slate-200 rounded" />
              <div className="ml-auto h-6 w-24 bg-slate-200 rounded-full" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100/80 text-center">
          <p className="text-slate-500 text-[14px]">{t('dashboard.users.no_results')}</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {users.map((user: AdminUser) => {
              const primaryRole = user.roles?.[0] ?? 'User'
              const displayName = user.fullName || user.email || 'Unknown'
              return (
                <div
                  key={user.userId}
                  className="bg-white rounded-2xl px-6 py-4 flex items-center gap-4 shadow-sm border border-slate-100/80 hover:shadow-md transition-shadow"
                >
                  <Avatar size="lg">
                    <AvatarImage src={getProfileImage(user.profileImageUrl)} alt={displayName} />
                    <AvatarFallback className="bg-slate-200 text-slate-600 text-sm font-medium">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[15px] font-semibold text-slate-800">{displayName}</span>
                  <span
                    className={`ml-auto px-4 py-1.5 rounded-full text-[12px] font-semibold ${getRoleBadgeStyle(primaryRole)}`}
                  >
                    {primaryRole}
                  </span>
                  <button
                    onClick={() => handleDelete(user.userId)}
                    className="ml-4 p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                    title={t('dashboard.users.delete_title')}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Load More */}
          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isFetchingNextPage ? t('dashboard.common.loading') : t('dashboard.common.load_more')}
              </button>
            </div>
          )}

          <p className="text-center text-[12px] text-slate-400 mt-4">
            {t('dashboard.users.showing', { count: users.length, total: totalCount })}
          </p>
        </>
      )}

      {/* Click outside to close dropdown */}
      {showRoleDropdown && (
        <div className="fixed inset-0 z-10" onClick={() => setShowRoleDropdown(false)} />
      )}

      {/* Create Content Manager Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-slate-900 mb-6">{t('dashboard.users.new_cm')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.users.form.full_name')}</label>
                <input
                  type="text"
                  value={createForm.fullName}
                  onChange={(e) => setCreateForm((p) => ({ ...p, fullName: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20"
                  placeholder={t('dashboard.users.form.full_name_placeholder')}
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.users.form.email')}</label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20"
                  placeholder={t('dashboard.users.form.email_placeholder')}
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.users.form.password')}</label>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20"
                  placeholder={t('dashboard.users.form.password_placeholder')}
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.users.form.phone')}</label>
                <input
                  type="tel"
                  value={createForm.phoneNumber}
                  onChange={(e) => setCreateForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 text-[14px] outline-none focus:border-[#0a5c66] focus:ring-2 focus:ring-[#0a5c66]/20"
                  placeholder={t('dashboard.users.form.phone_placeholder')}
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-slate-600 mb-1.5">{t('dashboard.users.form.profile_image')}</label>
                <input
                  ref={createFileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCreateProfileImage(e.target.files?.[0] ?? null)}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => createFileInputRef.current?.click()}
                  className="w-full h-10 px-3 rounded-lg border border-dashed border-slate-300 text-[13px] text-slate-500 hover:bg-slate-50 hover:border-slate-400 transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {createProfileImage ? createProfileImage.name : t('dashboard.users.form.choose_image')}
                </button>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setCreateForm({ fullName: '', email: '', password: '', phoneNumber: '' })
                  setCreateProfileImage(null)
                }}
                className="flex-1 h-10 rounded-lg border border-slate-200 text-[14px] font-medium text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                {t('dashboard.common.cancel')}
              </button>
              <button
                onClick={handleCreate}
                disabled={!createForm.fullName || !createForm.email || !createForm.password || createMutation.isPending}
                className="flex-1 h-10 rounded-lg bg-[#0a5c66] text-white text-[14px] font-medium hover:bg-[#094d55] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {createMutation.isPending ? t('dashboard.users.form.creating') : t('dashboard.common.create')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
