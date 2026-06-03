import { useInfiniteQuery } from '@tanstack/react-query'
import { axiosInstance } from '@/api/axiosInstance'
import type {
  CommunityPostsApiResponse,
  CommunityPostsData,
} from '@/api/community/useCommunityPosts.types'

interface UserPostsParams {
  userId: number
  pageNumber: number
  pageSize: number
}

async function fetchUserPosts(params: UserPostsParams): Promise<CommunityPostsData> {
  const { data } = await axiosInstance.get<CommunityPostsApiResponse>('/api/community-posts', {
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
    },
  })

  const userItems = data.data.items.filter((post) => post.user.userId === params.userId)

  return {
    items: userItems,
    pagination: data.data.pagination,
  }
}

export function useUserPosts(userId: number | null, pageSize = 10) {
  return useInfiniteQuery({
    queryKey: ['user-posts', userId, pageSize],
    queryFn: ({ pageParam }) =>
      fetchUserPosts({ userId: userId!, pageNumber: pageParam, pageSize }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    enabled: userId != null,
  })
}
