import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/lib/AuthContext'
import { useUserPosts } from '@/api/user/useUserPosts'
import { useUpdatePost, useDeletePost } from '@/api/community/useCommunityPosts'
import PostCard from '@/components/atoms/PostCard'
import { ArrowLeft } from 'lucide-react'

const Posts = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { userId } = useAuthContext()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isError,
  } = useUserPosts(userId)

  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost()
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost()

  const items = data?.pages.flatMap((p) => p.items) ?? []

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
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            {t('profile.posts', 'My Posts')}
          </h1>
        </div>

        {isError && (
          <p className="text-destructive text-center py-8">{t('label.no_results')}</p>
        )}

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
              onReport={() => {}}
              onEdit={handleEdit}
              onDelete={handleDelete}
              isUpdating={isUpdating}
              isDeleting={isDeleting}
            />
          ))}
        </div>

        {isFetching && items.length === 0 && (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[200px] animate-pulse rounded-[24px] bg-muted"
              />
            ))}
          </div>
        )}

        {!isFetching && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground gap-3">
            <p className="text-lg font-medium">{t('community.no_posts', 'No posts yet')}</p>
            <p className="text-sm">{t('community.be_first', 'Be the first to share something!')}</p>
          </div>
        )}

        {hasNextPage && !isFetching && (
          <button
            onClick={() => fetchNextPage()}
            className="mt-6 w-full rounded-full bg-primary-7 py-3 text-sm font-bold text-white hover:bg-primary-8 transition-colors cursor-pointer"
          >
            {t('label.load_more', 'Load More')}
          </button>
        )}
      </div>
    </div>
  )
}

export default Posts
