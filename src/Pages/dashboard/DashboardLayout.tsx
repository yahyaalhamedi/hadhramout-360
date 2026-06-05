import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { useAuthContext } from '@/lib/AuthContext'
import { useGetRtl } from '@/lib/utils'
import hadhramoutAR from '@/assets/hadhramoutAR.svg'
import hadhramoutEN from '@/assets/hadhramoutEN.svg'
import { Roles } from '@/lib/roles'
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  PenTool,
  Compass,
  Users,
  AlertCircle,
  LogOut,
  Globe,
} from 'lucide-react'

const navLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Landmarks', icon: MapPin, path: '/dashboard/landmarks' },
  { label: 'Events', icon: Calendar, path: '/dashboard/events' },
  { label: 'Artisans', icon: PenTool, path: '/dashboard/artisans' },
  { label: 'Discover', icon: Compass, path: '/dashboard/discover' },
]

const adminLinks = [
  { label: 'User Management', icon: Users, path: '/dashboard/users', roles: [Roles.Admin] },
  { label: 'Reports', icon: AlertCircle, path: '/dashboard/reports', roles: [Roles.Admin] },
]

export default function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout, roles } = useAuthContext()
  const isRtl = useGetRtl()
  const logo = isRtl ? hadhramoutAR : hadhramoutEN

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path: string) => {
    if (path === '/dashboard') return location.pathname === '/dashboard'
    return location.pathname.startsWith(path)
  }

  const visibleAdminLinks = adminLinks.filter((link) =>
    link.roles.some((r) => roles.includes(r)),
  )

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

          {/* Divider */}
          <div className="!my-5 border-t border-slate-200" />

          {/* Administration */}
          {visibleAdminLinks.length > 0 && (
            <>
              <p className="px-5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Administration
              </p>
              {visibleAdminLinks.map((link) => {
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
            </>
          )}
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
