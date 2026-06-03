import { Heart, LayoutGrid, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '@/api/auth/useAuth'

interface UserProfilePopoverProps {
  userName: string
  userEmail: string
  userPhone?: string
  avatarUrl?: string
  onLogoutSuccess: () => void
}

export default function UserProfilePopover({
  userName,
  userEmail,
  userPhone = '779152718', // Default phone fallback from mockup
  avatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', // Beautiful smiling face matching mockup style
  onLogoutSuccess,
}: UserProfilePopoverProps) {
  const navigate = useNavigate()

  const handleLogoutClick = () => {
    logoutUser()
    onLogoutSuccess()
    navigate('/')
  }

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
        Hi, {userName || 'User'}
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
        Edit Profile
      </button>

      {/* Action Buttons Stack */}
      <div className="w-full flex flex-col gap-3">
        {/* My Favorites */}
        <button
          onClick={() => navigate('/favorites')}
          className="w-full h-12 rounded-2xl bg-[#e8f1f2] hover:bg-[#dceced] text-[#0a5c66] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
        >
          <Heart className="h-4 w-4 fill-[#0a5c66]" />
          <span>my favorites</span>
        </button>

        {/* My Posts */}
        <button
          onClick={() => navigate('/posts')}
          className="w-full h-12 rounded-2xl bg-[#e8f1f2] hover:bg-[#dceced] text-[#0a5c66] font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200"
        >
          <LayoutGrid className="h-4 w-4" />
          <span>my posts</span>
        </button>

        {/* Logout */}
        <button
          onClick={handleLogoutClick}
          className="w-full h-12 rounded-2xl bg-[#f5d6d6] hover:bg-[#f1c5c5] text-red-600 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors duration-200 mt-1"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}
