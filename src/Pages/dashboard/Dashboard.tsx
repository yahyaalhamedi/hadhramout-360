import { useNavigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '@/lib/AuthContext'
import { useGetRtl } from '@/lib/utils'
import hadhramoutAR from '@/assets/hadhramoutAR.svg'
import hadhramoutEN from '@/assets/hadhramoutEN.svg'
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  PenTool,
  Compass,
  Users,
  Building2,
  AlertCircle,
  Landmark,
  FolderOpen,
  LogOut,
  Globe,
} from 'lucide-react'

const stats = [
  { label: 'Users', value: '24,892', icon: Users, iconBg: 'bg-teal-100', iconColor: 'text-teal-700' },
  { label: 'Organizations', value: '1,204', icon: Building2, iconBg: 'bg-amber-100', iconColor: 'text-amber-700' },
  { label: 'Reports', value: '42', icon: AlertCircle, iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
  { label: 'Landmarks', value: '834', icon: Landmark, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
  { label: 'Events', value: '124', icon: Calendar, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
  { label: 'Artisans', value: '453', icon: PenTool, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
  { label: 'Discover', value: '368', icon: Compass, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
  { label: 'Published Content', value: '3,546', icon: FolderOpen, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
]

const navLinks = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Landmarks', icon: MapPin, path: '/landmarks' },
  { label: 'Events', icon: Calendar, path: '/events' },
  { label: 'Artisans', icon: PenTool, path: '/artisans' },
  { label: 'Discover', icon: Compass, path: '/discover' },
]

const adminLinks = [
  { label: 'User Management', icon: Users, path: '/dashboard/users' },
  { label: 'Reports', icon: AlertCircle, path: '/dashboard/reports' },
]

const Dashboard = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuthContext()
  const isRtl = useGetRtl()
  const logo = isRtl ? hadhramoutAR : hadhramoutEN

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path: string) => location.pathname === path

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
          <p className="px-5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Administration
          </p>
          {adminLinks.map((link) => {
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
        <h2 className="text-[40px] font-bold text-slate-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          WELCOME
        </h2>
        <p className="text-slate-500 text-[14px] mb-10 max-w-lg leading-relaxed">
          Manage and monitor the Digital Oasis ecosystem from one centralized administration workspace.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-slate-100/80 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-[13px] text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-[26px] font-bold text-slate-800 leading-tight">{stat.value}</p>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
