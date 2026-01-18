import { Input } from '@/components/Input'
import { InViewDetector } from '@/components/InViewDetector'
import { LoadingDots } from '@/components/LoadingDots'
import { SearchBar } from '@/components/SearchBar'
import { SelectBox } from '@/components/SelectBox'
import { Spacing } from '@/components/Spacing'
import { Table } from '@/components/Table'
import { useDebounce } from '@/hooks/useDebounce'
import { useQueryParam } from '@/hooks/useQueryParam'
import { fetchPostsInfiniteQueryOption } from '@/pages/home/query-options/post'
import { RouteUrls } from '@/utils/routeUrls'
import { noop, useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { CreatePostButton } from './components/CreatePostButton'
import { DeleteAllPostButton } from './components/DeleteAllPostButton'
import { Flex } from '@/components/Flex'
import { PostDeleteButton } from './components/PostDeleteButton'
import { PostTableCell } from './components/PostTableCell'
import { Tag } from '@/components/Tag'
import { formatTime } from '@/utils/formattdTime'
import { usePostDialog } from '@/pages/home/hooks/usePostDialog'
import { fetchPostById } from '@/pages/home/apis/posts'

type ColumnKey = 'category' | 'title' | 'tags' | 'createdAt'

export function HomePage() {
  return (
    <Suspense
      fallback={
        <Flex
          justify="center"
          alignItems="center"
          css={{ minHeight: '100vh' }}>
          <LoadingDots />
        </Flex>
      }>
      <Posts />
    </Suspense>
  )
}

function Posts() {
  const [, setSearchParams] = useSearchParams()

  const searchWord = useQueryParam('searchWord') ?? ''
  const [inputWord, setInputWord] = useState(searchWord)
  const debouncedInputWord = useDebounce(inputWord, 500)

  const category = useQueryParam('category')
  const sortBy = useQueryParam('sortBy')
  const orderBy = useQueryParam('orderBy')

  useEffect(() => {
    setSearchParams(
      RouteUrls.HOME({
        searchWord: debouncedInputWord,
        category,
        sortBy,
        orderBy
      })
    )
  }, [debouncedInputWord])

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery(
      fetchPostsInfiniteQueryOption({
        limit: 10,
        sort: sortBy,
        order: orderBy,
        category,
        search: searchWord
      })
    )

  const posts = data?.pages.flatMap(page => page.items) ?? []

  const [visibleColumns, setVisibleColumns] = useState<{
    category: boolean
    title: boolean
    tags: boolean
    createdAt: boolean
  }>({
    category: true,
    title: true,
    tags: true,
    createdAt: true
  })

  const [columnWidths, setColumnWidths] = useState<{
    category: number
    title: number
    tags: number
    createdAt: number
  }>({
    category: 100,
    title: 200,
    tags: 200,
    createdAt: 100
  })

  const startResizing = (key: ColumnKey, e: React.MouseEvent) => {
    e.preventDefault()

    const startX = e.clientX
    const startWidth = columnWidths[key]

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX
      const newWidth = Math.max(MIN_COLUMN_WIDTH, startWidth + delta)

      setColumnWidths(prev => ({
        ...prev,
        [key]: newWidth
      }))
    }

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }

  const postDialog = usePostDialog()

  const handleRowClick = useMutation({
    mutationFn: async ({ postId }: { postId: string }) => {
      try {
        const post = await fetchPostById({ id: postId })

        await postDialog.open({
          title: post.title,
          body: post.body,
          tags: post.tags.join(','),
          category: post.category
        })
      } catch (error) {
        console.log(error)
        window.alert('데이터 조회 중 에러가 발생했어요')
      }
    }
  })

  return (
    <>
      <Spacing size={16} />

      <Flex
        justify="space-between"
        css={{ padding: '0 24px' }}>
        <Flex
          justify="right"
          gap={16}>
          {(Object.entries(visibleColumns) as [ColumnKey, boolean][]).map(
            ([key, value]) => (
              <Input
                value=""
                label={key}
                type="checkbox"
                checked={value}
                onChange={() =>
                  setVisibleColumns(prev => ({
                    ...prev,
                    [key]: !prev[key]
                  }))
                }
              />
            )
          )}
        </Flex>

        <Flex
          justify="right"
          gap={16}>
          <SelectBox
            placeholder="카테고리"
            options={[
              { value: '', label: '전체' },
              { value: 'NOTICE', label: 'NOTICE' },
              { value: 'QNA', label: 'QNA' },
              { value: 'FREE', label: 'FREE' }
            ]}
            value={category}
            onChange={value =>
              setSearchParams(
                RouteUrls.HOME({
                  searchWord,
                  category: value,
                  sortBy,
                  orderBy
                })
              )
            }
          />
          <SelectBox
            placeholder="정렬"
            options={[
              {
                value: 'title',
                label: '제목'
              },
              {
                value: 'createdAt',
                label: '시간'
              }
            ]}
            value={sortBy}
            onChange={value =>
              setSearchParams(
                RouteUrls.HOME({
                  searchWord,
                  category,
                  sortBy: value,
                  orderBy
                })
              )
            }
          />
          <SelectBox
            placeholder="정렬방향"
            options={[
              {
                value: 'asc',
                label: '오름차순'
              },
              {
                value: 'desc',
                label: '내림차순'
              }
            ]}
            value={orderBy}
            onChange={value =>
              setSearchParams(
                RouteUrls.HOME({
                  searchWord,
                  category,
                  sortBy,
                  orderBy: value
                })
              )
            }
          />
          <SearchBar
            value={inputWord}
            placeholder={'검색할 단어를 입력하세요'}
            onChange={e => setInputWord(e.target.value)}
          />
        </Flex>
      </Flex>
      <Spacing size={40} />

      <Table
        size="sm"
        infiniteScroll>
        <Table.Header>
          <Table.HeaderRow>
            {visibleColumns.category && (
              <Table.HeaderCell
                resizable
                onResizeHandlerMouseDown={e => startResizing('category', e)}
                css={{
                  width: columnWidths.category,
                  position: 'relative',
                  userSelect: 'none'
                }}>
                카테고리
              </Table.HeaderCell>
            )}
            {visibleColumns.title && (
              <Table.HeaderCell
                resizable
                onResizeHandlerMouseDown={e => startResizing('title', e)}
                css={{
                  width: columnWidths.title,
                  position: 'relative',
                  userSelect: 'none'
                }}>
                제목
              </Table.HeaderCell>
            )}
            {visibleColumns.tags && (
              <Table.HeaderCell
                resizable
                onResizeHandlerMouseDown={e => startResizing('tags', e)}
                css={{
                  width: columnWidths.tags,
                  position: 'relative',
                  userSelect: 'none'
                }}>
                태그
              </Table.HeaderCell>
            )}
            {visibleColumns.createdAt && (
              <Table.HeaderCell
                resizable
                onResizeHandlerMouseDown={e => startResizing('createdAt', e)}
                css={{
                  width: columnWidths.createdAt,
                  position: 'relative',
                  userSelect: 'none'
                }}>
                작성날짜
              </Table.HeaderCell>
            )}
            <Table.HeaderCell
              css={{
                width: '100px'
              }}>
              삭제
            </Table.HeaderCell>
          </Table.HeaderRow>
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <Table.LoadingRow colSpan={5} />
          ) : posts.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={5}>데이터가 없어요</Table.Cell>
            </Table.Row>
          ) : (
            posts.map(post => {
              return (
                <Table.Row
                  key={post.id}
                  onClick={
                    handleRowClick.isPending
                      ? noop
                      : () => handleRowClick.mutate({ postId: post.id })
                  }>
                  {visibleColumns.category && (
                    <PostTableCell width={columnWidths.category}>
                      {post.category}
                    </PostTableCell>
                  )}
                  {visibleColumns.title && (
                    <PostTableCell width={columnWidths.title}>
                      {post.title}
                    </PostTableCell>
                  )}
                  {visibleColumns.tags && (
                    <PostTableCell width={columnWidths.tags}>
                      {post.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </PostTableCell>
                  )}
                  {visibleColumns.createdAt && (
                    <PostTableCell width={columnWidths.createdAt}>
                      {formatTime(post.createdAt)}
                    </PostTableCell>
                  )}
                  <Table.Cell
                    css={{
                      width: '100px',
                      wordBreak: 'break-word'
                    }}>
                    <Flex justify="space-around">
                      <PostDeleteButton post={post} />
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              )
            })
          )}
          {isFetchingNextPage && <Table.LoadingRow colSpan={5} />}
          <InViewDetector
            onDetect={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
              }
            }}
          />
        </Table.Body>
      </Table>

      <Flex
        gap={16}
        css={{ position: 'fixed', bottom: 12, right: 8 }}>
        <DeleteAllPostButton />
        <CreatePostButton />
      </Flex>
    </>
  )
}

const MIN_COLUMN_WIDTH = 60
