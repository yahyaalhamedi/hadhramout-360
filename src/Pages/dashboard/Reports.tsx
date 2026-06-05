import { useMemo } from 'react'
import { Shield, Trash2, XCircle } from 'lucide-react'
import {
  useCommunityPostReports,
  useDismissReport,
  useDeleteReportedPost,
} from '@/api/admin/useCommunityPostReports'
import type { CommunityPostReportResponseDto } from '@/api/admin/useCommunityPostReports.types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { baseURL } from '@/api/axiosInstance'

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

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHrs = Math.floor(diffMins / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  if (diffDays < 30) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export default function Reports() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useCommunityPostReports({
    pageSize: 10,
  })

  const dismissMutation = useDismissReport()
  const deletePostMutation = useDeleteReportedPost()

  const reports = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? []
  }, [data])

  const totalCount = data?.pages[0]?.pagination.totalEntries ?? 0

  const handleDismiss = (reportId: number) => {
    if (!confirm('Are you sure you want to dismiss this report?')) return
    dismissMutation.mutate(reportId)
  }

  const handleDeletePost = (reportId: number) => {
    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return
    deletePostMutation.mutate(reportId)
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-[40px] font-bold text-slate-900" style={{ fontFamily: 'Georgia, serif' }}>
          REPORTS
        </h2>
        <div className="flex items-center gap-2 text-[13px] text-slate-500">
          <Shield className="h-4 w-4" />
          <span>{totalCount} total reports</span>
        </div>
      </div>

      {/* Reports List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 w-48 bg-slate-200 rounded" />
                  <div className="h-3 w-full bg-slate-100 rounded" />
                  <div className="h-3 w-32 bg-slate-100 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-slate-100/80 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">No Reports</h3>
          <p className="text-sm text-slate-500">There are no community post reports at this time.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reports.map((report: CommunityPostReportResponseDto) => (
              <div
                key={report.reportId}
                className="bg-white rounded-2xl shadow-sm border border-slate-100/80 hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Reporter Info */}
                <div className="px-6 pt-5 pb-3 flex items-center gap-3">
                  <Avatar size="lg">
                    <AvatarImage
                      src={getProfileImage(report.reportedBy.profileImageUrl)}
                      alt={report.reportedBy.fullName ?? ''}
                    />
                    <AvatarFallback className="bg-slate-200 text-slate-600 text-sm font-medium">
                      {getInitials(report.reportedBy.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-slate-800">
                      {report.reportedBy.fullName ?? 'Unknown User'}
                    </p>
                    <p className="text-[12px] text-slate-400">Reported {timeAgo(report.createdAt)}</p>
                  </div>
                </div>

                {/* Report Reason */}
                {report.reason && (
                  <div className="px-6 pb-3">
                    <div className="bg-amber-50 rounded-lg px-4 py-2.5">
                      <p className="text-[12px] font-semibold text-amber-700 uppercase tracking-wide mb-0.5">Reason</p>
                      <p className="text-[13px] text-amber-800">{report.reason}</p>
                    </div>
                  </div>
                )}

                {/* Reported Post Preview */}
                <div className="mx-6 mb-4 bg-slate-50 rounded-xl px-5 py-4 border border-slate-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar>
                      <AvatarImage
                        src={getProfileImage(report.reportedPost.user.profileImageUrl)}
                        alt={report.reportedPost.user.fullName ?? ''}
                      />
                      <AvatarFallback className="bg-slate-200 text-slate-600 text-xs">
                        {getInitials(report.reportedPost.user.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[13px] font-medium text-slate-600">
                      {report.reportedPost.user.fullName ?? 'Unknown'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      · {timeAgo(report.reportedPost.createdAt)}
                    </span>
                  </div>
                  <p className="text-[13px] text-slate-700 leading-relaxed line-clamp-3">
                    {report.reportedPost.contentText ?? 'No text content'}
                  </p>
                  {report.reportedPost.media && report.reportedPost.media.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {report.reportedPost.media.slice(0, 3).map((m) => (
                        <div
                          key={m.mediaId}
                          className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden"
                        >
                          {m.mediaUrl && (
                            <img
                              src={m.mediaUrl.startsWith('http') ? m.mediaUrl : `${baseURL}${m.mediaUrl}`}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      ))}
                      {report.reportedPost.media.length > 3 && (
                        <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center text-[11px] text-slate-500 font-medium">
                          +{report.reportedPost.media.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="px-6 pb-5 flex gap-3">
                  <button
                    onClick={() => handleDismiss(report.reportId)}
                    disabled={dismissMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <XCircle className="h-4 w-4" />
                    Dismiss Report
                  </button>
                  <button
                    onClick={() => handleDeletePost(report.reportId)}
                    disabled={deletePostMutation.isPending}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-[13px] font-medium text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Post
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasNextPage && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isFetchingNextPage ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}

          <p className="text-center text-[12px] text-slate-400 mt-4">
            Showing {reports.length} of {totalCount} reports
          </p>
        </>
      )}
    </>
  )
}
