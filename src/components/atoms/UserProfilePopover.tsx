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
  onLogoutSuccess: () => void
}

export default function UserProfilePopover({
  userName,
  userEmail,
  userPhone,
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  roles = [],
  onLogoutSuccess,
}: UserProfilePopoverProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logout } = useAuthContext()

  const handleLogoutClick = () => {
    logout()
    onLogoutSuccess()
    navigate('/')
  }

  const showDashboard = hasAnyRole(roles, [Roles.Admin, Roles.ContentManager])
  const showOrgPanel = hasAnyRole(roles, [Roles.Organization])

  return (
    <div className="w-[320px] bg-white rounded-[32px] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col items-center text-center transition-all duration-300">
      {/* Avatar circular frame */}
      <div className="relative mb-3">
        <img
          src={avatarUrl}
          alt={userName}
          className="w-[84px] h-[84px] rounded-full object-cover border-2 border-white shadow-md"
        />
      </div>

      {/* Hi, Name */}
      <h3 className="text-xl font-bold text-[#0a5c66] mb-1">
        {t('community.hi')} {userName || 'User'}
      </h3>

      {/* Email (Underlined) */}
      <a
        href={`mailto:${userEmail}`}
        className="text-xs text-slate-500 hover:text-[#0a5c66] underline font-medium mb-0.5"
      >
        {userEmail}
      </a>

      {/* Phone Number */}
      {userPhone && (
        <span className="text-xs text-slate-400 font-medium mb-3">
          {userPhone}
        </span>
      )}

      {/* Edit Profile Link */}
      <button
        onClick={() => navigate('/profile/edit')}
        className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors mb-6 cursor-pointer"
      >
        {t('profile.edit', 'Edit Profile')}
      </button>

      {/* Action Buttons Stack */}
      <div className="w-full flex flex-col gap-3">
        {/* Dashboard — Admin & ContentManager */}
        {showDashboard && (
          <button
            onClick={() => navigate('/admin')}
            className="w-full h-12 rounded-2xl bg-[#0a5c66] hover:bg-[#084f57] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
          >
            <Shield className="h-4 w-4" />
            <span>{t('profile.dashboard', 'Dashboard')}</span>
          </button>
        )}

        {/* Organization Panel — Organization role */}
        {showOrgPanel && (
          <button
            onClick={() => navigate('/org-panel')}
            className="w-full h-12 rounded-2xl bg-[#0a5c66] hover:bg-[#084f57] text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
          >
            <Building2 className="h-4 w-4" />
            <span>{t('profile.org_panel', 'Organization Panel')}</span>
          </button>
        )}

        {/* My Favorites */}
        <button
          onClick={() => navigate('/favorites')}
          className="w-full h-12 rounded-2xl bg-[#e8f1f2] hover:bg-[#dceced] text-[#0a5c66] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
        >
          <Heart className="h-4 w-4 fill-[#0a5c66]" />
          <span>{t('profile.favorites', 'My Favorites')}</span>
        </button>

        {/* My Posts */}
        <button
          onClick={() => navigate('/posts')}
          className="w-full h-12 rounded-2xl bg-[#e8f1f2] hover:bg-[#dceced] text-[#0a5c66] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
        >
          <LayoutGrid className="h-4 w-4" />
          <span>{t('profile.posts', 'My Posts')}</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogoutClick}
          className="w-full h-12 rounded-2xl bg-[#f5d6d6] hover:bg-[#f1c5c5] text-red-600 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 mt-1"
        >
          <LogOut className="h-4 w-4" />
          <span>{t('profile.logout', 'Logout')}</span>
        </button>
      </div>
    </div>
  )
}
