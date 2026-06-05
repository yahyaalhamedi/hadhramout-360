import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthContext } from '@/lib/AuthContext'
import { useGetRtl } from '@/lib/utils'
import hadhramoutAR from '@/assets/hadhramoutAR.svg'
import hadhramoutEN from '@/assets/hadhramoutEN.svg'
import { User, Calendar, LogOut, Globe } from 'lucide-react'

const navLinks = [
  { label: 'Profile', icon: User, path: '/org-panel' },
  { label: 'Events', icon: Calendar, path: '/org-panel/events' },
]

export default function OrgPanelLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuthContext()
  const isRtl = useGetRtl()
  const logo = isRtl ? hadhramoutAR : hadhramoutEN

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path: string) => {
    if (path === '/org-panel') return location.pathname === '/org-panel'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      {/* Sidebar */}
      <aside className="w-[260px] bg-white flex flex-col shrink-0 fixed top-0 left-0 h-screen z-10">
        {/* Logo */}
        <div className="px-7 py-6">
          <button onClick={() => navigate('/')} className="cursor-pointer">
            <img
              src={logo}
              alt="Hadhramout 360"
              className="h-8 w-[220px]"
            />
          </button>
        </div>

        {/* Main Nav */}
        <nav className="flex-1 px-3 space-y-0.5">
          {navLinks.map((link) => {
            const Icon = link.icon
            const active = isActive(link.path)
            return (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`relative w-full flex items-center gap-3 px-5 py-3 rounded-lg text-[14px] font-medium transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#eaf4f5] text-[#0a5c66]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#0a5c66] rounded-r-full" />
                )}
                <Icon className="h-[18px] w-[18px]" />
                <span>{link.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-4 space-y-0.5">
          <button className="w-full flex items-center gap-3 px-5 py-3 rounded-lg text-[14px] font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors cursor-pointer">
            <Globe className="h-[18px] w-[18px]" />
            <span>Language</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3 rounded-lg text-[14px] font-medium text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="h-[18px] w-[18px]" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-[260px] p-12">
        <Outlet />
      </main>
    </div>
  )
}
