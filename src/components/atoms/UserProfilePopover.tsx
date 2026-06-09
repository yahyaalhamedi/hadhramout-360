import { Heart, LayoutGrid, LogOut, Shield, Building2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthContext } from '@/lib/AuthContext'
import { Roles, hasAnyRole } from '@/lib/roles'
import type { Role } from '@/lib/roles'

interface UserProfilePopoverProps {
  userName: string
  userEmail: string
  userPhone?: string
  avatarUrl?: string
  isAdmin?: boolean
  roles?: Role[]
  onLogoutRequest: () => void
}

export default function UserProfilePopover({
  userName,
  userEmail,
  userPhone,
  avatarUrl = '/profile.png',
  roles = [],
  onLogoutRequest,
}: UserProfilePopoverProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const showDashboard = hasAnyRole(roles, [Roles.Admin, Roles.ContentManager])
  const showOrgPanel = hasAnyRole(roles, [Roles.Organization])

  return (
    <div className="w-[280px] bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex flex-col items-center text-center transition-all duration-300">
      {/* Avatar circular frame */}
      <div className="relative mb-2.5">
        <img
          src={avatarUrl}
          alt={userName}
          className="w-[72px] h-[72px] rounded-full object-cover border-[1.5px] border-white shadow-sm"
        />
      </div>

      {/* Hi, Name */}
      <h3 className="text-lg font-bold text-[#0a5c66] mb-0.5">
        {t('community.hi')} {userName || 'User'}
      </h3>

      {/* Email (Underlined) */}
      <a
        href={`mailto:${userEmail}`}
        className="text-[11px] text-slate-500 hover:text-[#0a5c66] underline font-medium mb-0.5"
      >
        {userEmail}
      </a>

      {/* Phone Number */}
      {userPhone && (
        <span className="text-[11px] text-slate-400 font-medium mb-2.5">
          {userPhone}
        </span>
      )}

      {/* Edit Profile Link */}
      <button
        onClick={() => navigate('/profile/edit')}
        className="text-[11px] font-semibold text-amber-600 hover:text-amber-700 transition-colors mb-4 cursor-pointer"
      >
        {t('profile.edit', 'Edit Profile')}
      </button>

      {/* Action Buttons Stack */}
      <div className="w-full flex flex-col gap-2">
        {/* Dashboard — Admin & ContentManager */}
        {showDashboard && (
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full h-10 rounded-xl bg-[#0a5c66] hover:bg-[#084f57] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]"
          >
            <Shield className="h-4 w-4" />
            <span>{t('profile.dashboard', 'Dashboard')}</span>
          </button>
        )}

        {/* Organization Panel — Organization role */}
        {showOrgPanel && (
          <button
            onClick={() => navigate('/org-panel')}
            className="w-full h-10 rounded-xl bg-[#0a5c66] hover:bg-[#084f57] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-md active:scale-[0.98]"
          >
            <Building2 className="h-4 w-4" />
            <span>{t('profile.org_panel', 'Organization Panel')}</span>
          </button>
        )}

        {/* My Favorites */}
        <button
          onClick={() => navigate('/favorites')}
          className="w-full h-10 rounded-xl bg-[#e8f1f2] hover:bg-[#dceced] text-[#0a5c66] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-sm active:scale-[0.98]"
        >
          <Heart className="h-4 w-4 fill-[#0a5c66]" />
          <span>{t('profile.favorites', 'My Favorites')}</span>
        </button>

        {/* My Posts */}
        <button
          onClick={() => navigate('/posts')}
          className="w-full h-10 rounded-xl bg-[#e8f1f2] hover:bg-[#dceced] text-[#0a5c66] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-sm active:scale-[0.98]"
        >
          <LayoutGrid className="h-4 w-4" />
          <span>{t('profile.posts', 'My Posts')}</span>
        </button>

        {/* Logout */}
        <button
          onClick={onLogoutRequest}
          className="w-full h-10 rounded-xl bg-[#f5d6d6] hover:bg-[#f1c5c5] text-red-600 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:shadow-sm active:scale-[0.98] mt-1"
        >
          <LogOut className="h-4 w-4" />
          <span>{t('profile.logout', 'Logout')}</span>
        </button>
      </div>
    </div>
  )
}
