import { fetchPosts } from '@/apis/posts'
import { infiniteQueryOptions } from '@tanstack/react-query'

export const fetchPostsInfiniteQueryOption = ({
  limit = 10,
  sort = 'createdAt',
  order = 'asc',
  category,
  from,
  to,
  search
}: {
  limit?: number
  sort?: string
  order?: string
  category?: string
  from?: string
  to?: string
  search?: string
}) =>
  infiniteQueryOptions({
    queryKey: ['fetchPosts', limit, sort, order, category, from, to, search],
    initialPageParam: null,
    queryFn: ({ pageParam }: { pageParam: string | null }) => {
      return fetchPosts({
        limit,
        sort,
        order,
        category,
        from,
        to,
        search,
        nextCursor: pageParam ?? undefined
      })
    },
    getNextPageParam: lastPage => lastPage.nextCursor ?? undefined,
    getPreviousPageParam: lastPage => lastPage.prevCursor ?? undefined
  })
