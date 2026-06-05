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

const Dashboard = () => {
  return (
    <>
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
    </>
  )
}

export default Dashboard
