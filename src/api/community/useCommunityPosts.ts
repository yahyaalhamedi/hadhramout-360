import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { axiosInstance } from '@/api/axiosInstance'
import type {
  CommunityPostsApiResponse,
  CommunityPostsData,
  CommunityPostsParams,
  CreatePostResponse,
  ReportResponseDtoApiResponse,
} from './useCommunityPosts.types'

type UseCommunityPostsParams = Omit<CommunityPostsParams, 'pageNumber'>

// ── Fetch functions ───────────────────────────────────────────────

async function fetchCommunityPosts(params: CommunityPostsParams): Promise<CommunityPostsData> {
  const { data } = await axiosInstance.get<CommunityPostsApiResponse>('/api/community-posts', {
    params: {
      PageNumber: params.pageNumber,
      PageSize: params.pageSize,
      ...(params.search ? { Search: params.search } : {}),
    },
  })
  return data.data
}

async function createPost(payload: {
  contentText: string
  files?: File[]
}): Promise<CreatePostResponse> {
  const formData = new FormData()
  formData.append('ContentText', payload.contentText)

  if (payload.files) {
    payload.files.forEach((file) => {
      formData.append('Files', file)
    })
  }

  const { data } = await axiosInstance.post<CreatePostResponse>(
    '/api/community-posts/with-media',
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
  return data
}

async function reportPost(payload: { postId: number; reason: string }): Promise<ReportResponseDtoApiResponse> {
  const { data } = await axiosInstance.post<ReportResponseDtoApiResponse>(
    `/api/community-posts/${payload.postId}/report`,
    { reason: payload.reason },
  )
  return data
}

// ── Hooks ─────────────────────────────────────────────────────────

export function useCommunityPosts({ search, pageSize }: UseCommunityPostsParams) {
  return useInfiniteQuery({
    queryKey: ['community-posts', { search, pageSize }],
    queryFn: ({ pageParam }) =>
      fetchCommunityPosts({ pageNumber: pageParam, pageSize, search }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.pagination.nextPage ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.pagination.previousPage ?? undefined,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['community-posts'] })
    },
  })
}

export function useReportPost() {
  return useMutation({
    mutationFn: reportPost,
  })
}
