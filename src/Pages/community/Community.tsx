import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroller'
import PostCard from '@/components/atoms/PostCard'
import CreatePostForm from '@/components/atoms/CreatePostForm'
import ReportModal from '@/components/atoms/ReportModal'
import DeletePostModal from '@/components/atoms/DeletePostModal'
import { useTranslation } from 'react-i18next'
import {
  useCommunityPosts,
  useReportPost,
  useUpdatePost,
  useDeletePost,
} from '@/api/community/useCommunityPosts'
import { useAuthContext } from '@/lib/AuthContext'
import { useProfile } from '@/api/account/useAccount'

const Community = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [refreshKey, setRefreshKey] = useState(0)

  const { userName, userId, isLoggedIn } = useAuthContext()
  const { data: profile } = useProfile({ enabled: isLoggedIn })
  const displayName = profile?.fullName || userName || 'User'

  const feedRef = useRef<HTMLDivElement>(null)

  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportingPostId, setReportingPostId] = useState<number | null>(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null)

  const { data, fetchNextPage, hasNextPage, isFetching, isError } = useCommunityPosts({
    pageSize: 5,
  })

  const { mutate: reportPost, isPending: isReporting } = useReportPost()
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost()
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost()

  const items = data?.pages.flatMap((p) => p.items) ?? []

  const handleReport = useCallback((postId: number) => {
    setReportingPostId(postId)
    setReportModalOpen(true)
  }, [])

  const handleReportConfirm = useCallback(
    (reason: string) => {
      if (reportingPostId !== null) {
        reportPost({ postId: reportingPostId, reason }, {
          onSuccess: () => {
            setReportModalOpen(false)
            setReportingPostId(null)
          },
        })
      }
    },
    [reportingPostId, reportPost],
  )

  const handleDelete = useCallback((postId: number) => {
    setDeletingPostId(postId)
    setDeleteModalOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (deletingPostId !== null) {
      deletePost(deletingPostId, {
        onSuccess: () => {
          setDeleteModalOpen(false)
          setDeletingPostId(null)
        },
      })
    }
  }, [deletingPostId, deletePost])

  const handleEdit = useCallback(
    (postId: number, newContent: string) => {
      updatePost({ postId, contentText: newContent })
    },
    [updatePost],
  )

  return (
    <div className="min-h-screen bg-tertiary-0">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {isLoggedIn ? (
                <CreatePostForm
                  userName={displayName}
                  userAvatar={profile?.profileImageUrl ?? null}
                  onPostCreated={() => setRefreshKey((k) => k + 1)}
                />
              ) : (
                <div className="rounded-[24px] bg-white p-6 shadow-sm border border-tertiary-1 text-center space-y-4">
                  <div className="mx-auto h-16 w-16 rounded-full bg-primary-6/10 flex items-center justify-center">
                    <svg className="h-8 w-8 text-primary-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-tertiary-8">{t('community.join_community')}</h3>
                  <p className="text-sm text-muted-foreground">{t('community.join_description')}</p>
                  <button
                    onClick={() => navigate('/auth')}
                    className="w-full rounded-full bg-primary-7 py-3 text-sm font-bold text-white hover:bg-primary-8 transition-colors cursor-pointer"
                  >
                    {t('community.join_button')}
                  </button>
                </div>
              )}

              {/* View All Posts Button */}
              <button
                onClick={() => navigate('/posts')}
                className="w-full rounded-full bg-primary-7 py-4 text-sm font-bold text-white hover:bg-primary-8 transition-colors cursor-pointer"
              >
                {t('community.view_all_posts')}
              </button>
            </div>
          </div>

          {/* Feed */}
          <div ref={feedRef} className="flex-1 min-w-0">
            {isError && (
              <p className="text-destructive text-center py-8">{t('label.no_results')}</p>
            )}

            <InfiniteScroll
              key={refreshKey}
              pageStart={0}
              loadMore={() => {
                if (!isFetching) void fetchNextPage()
              }}
              hasMore={!!hasNextPage}
              loader={
                <div key="loader" className="space-y-6">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-[300px] animate-pulse rounded-[24px] bg-muted"
                    />
                  ))}
                </div>
              }
            >
              <div className="space-y-6">
                {items.map((post) => (
                  <PostCard
                    key={post.postId}
                    postId={post.postId}
                    userName={post.user.fullName || 'Unknown'}
                    userAvatar={post.user.profileImageUrl}
                    contentText={post.contentText}
                    createdAt={post.createdAt}
                    media={post.media}
                    postUserId={post.user.userId}
                    currentUserId={userId}
                    onReport={() => handleReport(post.postId)}
                    onEdit={handleEdit}
                    onDelete={() => handleDelete(post.postId)}
                    isUpdating={isUpdating}
                    isDeleting={isDeleting}
                  />
                ))}
              </div>
            </InfiniteScroll>

            {/* Initial loading skeletons */}
            {isFetching && items.length === 0 && (
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[300px] animate-pulse rounded-[24px] bg-muted"
                  />
                ))}
              </div>
            )}

            {!isFetching && items.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground gap-3">
                <p className="text-lg font-medium">{t('community.no_posts')}</p>
                <p className="text-sm">{t('community.be_first')}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ReportModal
        open={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false)
          setReportingPostId(null)
        }}
        onConfirm={handleReportConfirm}
        isPending={isReporting}
      />

      <DeletePostModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false)
          setDeletingPostId(null)
        }}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
      />
    </div>
  )
}

export default Community
