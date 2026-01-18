import type { Post, PostContent } from '@/models/post'
import { httpClient } from '@/utils/httpClient'

export interface Posts {
  items: Post[]
  nextCursor: string | null
  prevCursor: string | null
}

// 내 포스트 목록 조회
export const fetchPosts = (
  params: {
    limit?: number
    prevCursor?: string
    nextCursor?: string
    sort?: string
    order?: string
    category?: string
    from?: string
    to?: string
    search?: string
  } = {}
) => {
  return httpClient.get<Posts>(`/posts`, { params })
}

// 포스트 작성
export const createPosts = ({ title, body, category, tags }: PostContent) => {
  return httpClient.post<Post>(`/posts`, { title, body, category, tags })
}

// 내 모든 포스트 삭제
export const deletePosts = () => {
  return httpClient.delete<{
    ok: boolean
    deleted: number
  }>(`/posts`)
}

// 포스트 한건 조회
export const fetchPost = ({ id }: { id: string }) => {
  return httpClient.get<Post>(`/posts/${id}`)
}

// 포스트 한건 업데이트
export const updatePosts = ({
  id,
  post
}: {
  id: string
  post: PostContent
}) => {
  return httpClient.patch<Post>(`/posts/${id}`, post)
}

// 포스트 한건 삭제
export const deletePost = ({ id }: { id: string }) => {
  return httpClient.delete<{
    ok: boolean
    deleted: number
  }>(`/posts/${id}`)
}
