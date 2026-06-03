import { useState, useCallback } from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import PostCard from '@/components/atoms/PostCard'
import CreatePostForm from '@/components/atoms/CreatePostForm'
import { useTranslation } from 'react-i18next'
import {
  useCommunityPosts,
  useReportPost,
  useUpdatePost,
  useDeletePost,
} from '@/api/community/useCommunityPosts'
import { useAuthContext } from '@/lib/AuthContext'

const Community = () => {
  const { t } = useTranslation()
  const [refreshKey, setRefreshKey] = useState(0)

  const { userName, userId } = useAuthContext()
  const displayName = userName || 'User'

  const { data, fetchNextPage, hasNextPage, isFetching, isError } = useCommunityPosts({
    pageSize: 5,
  })

  const { mutate: reportPost } = useReportPost()
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost()
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost()

  const items = data?.pages.flatMap((p) => p.items) ?? []

  const handleReport = useCallback(
    (postId: number) => {
      const reason = prompt(t('community.report_prompt'))
      if (reason) {
        reportPost({ postId, reason })
      }
    },
    [reportPost, t],
  )

  const handleEdit = useCallback(
    (postId: number, newContent: string) => {
      updatePost({ postId, contentText: newContent })
    },
    [updatePost],
  )

  const handleDelete = useCallback(
    (postId: number) => {
      deletePost(postId)
    },
    [deletePost],
  )

  return (
    <div className="min-h-screen bg-tertiary-0">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="w-full lg:w-[340px] shrink-0">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Create Post Form */}
              <CreatePostForm
                userName={displayName}
                userAvatar={null}
                onPostCreated={() => setRefreshKey((k) => k + 1)}
              />

              {/* View All Posts Button */}
              <button className="w-full rounded-full bg-primary-7 py-4 text-sm font-bold text-white hover:bg-primary-8 transition-colors cursor-pointer">
                {t('community.view_all_posts')}
              </button>
            </div>
          </div>

          {/* Feed */}
          <div className="flex-1 min-w-0">
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
                    userName={post.user.userName || 'Unknown'}
                    userAvatar={post.user.profileImageUrl}
                    contentText={post.contentText}
                    createdAt={post.createdAt}
                    media={post.media}
                    postUserId={post.user.userId}
                    currentUserId={userId}
                    onReport={() => handleReport(post.postId)}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
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
    </div>
  )
}

export default Community
