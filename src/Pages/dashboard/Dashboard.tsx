import { useTranslation } from 'react-i18next'
import { LayoutDashboard, Calendar, PenTool, Compass, Users, Building2, AlertCircle, Landmark, FolderOpen } from 'lucide-react'
import { useDashboardStats } from '@/api/admin/useDashboardStats'

const Dashboard = () => {
  const { t } = useTranslation()
  const { data: stats, isLoading, isError } = useDashboardStats()

  const statCards = stats
    ? [
        { label: t('dashboard.stats.users'), value: stats.usersCount, icon: Users, iconBg: 'bg-teal-100', iconColor: 'text-teal-700' },
        { label: t('dashboard.stats.organizations'), value: stats.organizationsCount, icon: Building2, iconBg: 'bg-amber-100', iconColor: 'text-amber-700' },
        { label: t('dashboard.stats.reports'), value: stats.reportsCount, icon: AlertCircle, iconBg: 'bg-rose-100', iconColor: 'text-rose-600' },
        { label: t('dashboard.stats.landmarks'), value: stats.landmarksCount, icon: Landmark, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
        { label: t('dashboard.stats.events'), value: stats.eventsCount, icon: Calendar, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
        { label: t('dashboard.stats.artisans'), value: stats.artisansCount, icon: PenTool, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
        { label: t('dashboard.stats.discover'), value: stats.discoverContentCount, icon: Compass, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
        { label: t('dashboard.stats.community_posts'), value: stats.communityPostsCount, icon: FolderOpen, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
        { label: t('dashboard.stats.total_content'), value: stats.totalContentCount, icon: LayoutDashboard, iconBg: 'bg-slate-100', iconColor: 'text-slate-600' },
      ]
    : []

  return (
    <>
      <h2 className="text-[40px] font-bold text-slate-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
        {t('dashboard.welcome')}
      </h2>
      <p className="text-slate-500 text-[14px] mb-10 max-w-lg leading-relaxed">
        {t('dashboard.welcome_desc')}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading
          ? Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-slate-100/80 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-slate-100" />
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-slate-100 rounded" />
                  <div className="h-7 w-16 bg-slate-100 rounded" />
                </div>
              </div>
            ))
          : isError
            ? (
              <div className="col-span-full text-center py-10 text-red-500">
                {t('dashboard.stats.error')}
              </div>
            )
            : statCards.map((stat) => {
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
                      <p className="text-[26px] font-bold text-slate-800 leading-tight">{stat.value.toLocaleString()}</p>
                    </div>
                  </div>
                )
              })}
      </div>
    </>
  )
}

export default Dashboard
