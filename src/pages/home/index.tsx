import { createPosts, deletePost, deletePosts, fetchPost } from '@/apis/posts'
import { Button } from '@/components/Button'
import { Flex } from '@/components/Flex'
import { Input } from '@/components/Input'
import { InViewDetector } from '@/components/InViewDetector'
import { LoadingDots } from '@/components/LoadingDots'
import { SearchBar } from '@/components/SearchBar'
import { SelectBox } from '@/components/SelectBox'
import { Spacing } from '@/components/Spacing'
import { Table } from '@/components/Table'
import { Tag } from '@/components/Tag'
import { Text } from '@/components/Text'
import { colors } from '@/constants/colors'
import { useConfirmDialog } from '@/hooks/useConfirmDialog'
import { useDebounce } from '@/hooks/useDebounce'
import { usePostDialog } from '@/hooks/usePostDialog'
import { useQueryParam } from '@/hooks/useQueryParam'
import type { PostContent } from '@/models/post'
import { fetchPostsInfiniteQueryOption } from '@/query-options/post'
import { formatTime } from '@/utils/formattdTime'
import { RouteUrls } from '@/utils/routeUrls'
import styled from '@emotion/styled'
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { Fragment, Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { FORBIDDEN_WORDS } from './constants/forbidden-word'

type ColumnKey = 'category' | 'title' | 'tags' | 'createdAt'
type ResizeFn = (key: ColumnKey, e: React.MouseEvent) => void

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

  const [visibleColumns, setVisibleColumns] = useState<
    Record<ColumnKey, boolean>
  >({
    category: true,
    title: true,
    tags: true,
    createdAt: true
  })

  const [columnWidths, setColumnWidths] = useState<Record<ColumnKey, number>>({
    category: 100,
    title: 200,
    tags: 200,
    createdAt: 100
  })

  const startResizing: ResizeFn = (key, e) => {
    e.preventDefault()

    const startX = e.clientX
    const startWidth = columnWidths[key]

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX
      const newWidth = Math.max(60, startWidth + delta)

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

  const queryClient = useQueryClient()
  const deletePostDialog = useConfirmDialog()

  const handleDeletePostClick = async ({ postId }: { postId: string }) => {
    const confirmed = await deletePostDialog.open({
      content: '포스트를 삭제하시겠습니까?',
      confirmButtonText: '확인',
      rejectButtonText: '취소'
    })

    if (!confirmed) {
      return
    }

    try {
      const res = await deletePost({ id: postId })

      if (res.ok) {
        alert('포스트가 삭제되었습니다')

        queryClient.invalidateQueries({
          queryKey: ['fetchPosts'],
          exact: false
        })
      } else {
        alert('삭제에 실패했습니다.')
      }
    } catch (err) {
      console.error(err)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const handleDeletePostsClick = async () => {
    const confirmed = await deletePostDialog.open({
      content: '모든 포스트를 삭제하시겠습니까?',
      confirmButtonText: '확인',
      rejectButtonText: '취소'
    })

    if (!confirmed) {
      return
    }

    try {
      const res = await deletePosts()

      if (res.ok) {
        alert('포스트가 모두 삭제되었습니다')

        queryClient.invalidateQueries({
          queryKey: ['fetchPosts'],
          exact: false
        })
      } else {
        alert('삭제에 실패했습니다.')
      }
    } catch (err) {
      console.error(err)
      alert('삭제 중 오류가 발생했습니다.')
    }
  }

  const postDialog = usePostDialog()

  const createPostMutation = useMutation({
    mutationFn: async (data: PostContent) => {
      try {
        if (
          FORBIDDEN_WORDS.some(forbiddenWord =>
            data.title.includes(forbiddenWord)
          )
        ) {
          alert('제목에 금칙어가 있어요')
          return
        }

        if (
          FORBIDDEN_WORDS.some(forbiddenWord =>
            data.body.includes(forbiddenWord)
          )
        ) {
          alert('본문에 금칙어가 있어요')
          return
        }

        await createPosts(data)
        alert('새 글이 등록되었습니다!')
        queryClient.invalidateQueries({
          queryKey: ['fetchPosts'],
          exact: false
        })
      } catch (error) {
        console.error(error)
        alert('글 등록 중 오류가 발생했습니다.')
      }
    }
  })

  const handleCreatePostClick = async () => {
    if (createPostMutation.isPending) return
    const result = await postDialog.open()
    if (!result) return

    createPostMutation.mutate(result)
  }

  const handleRowClick = async (postId: string) => {
    const postData = await fetchPost({ id: postId })

    if (!postData) return

    await postDialog.open({
      title: postData.title,
      body: postData.body,
      tags: postData.tags.join(','),
      category: postData.category
    })
  }

  return (
    <>
      <Spacing size={16} />

      <Flex
        justify="right"
        gap={16}
        css={{ width: '100%' }}>
        <Button onClick={() => handleDeletePostsClick()}>전체 삭제</Button>

        <Button
          onClick={handleCreatePostClick}
          disabled={createPostMutation.isPending}>
          새 글 작성
        </Button>

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

      <Spacing size={40} />
      <Table
        size="sm"
        infiniteScroll>
        <Table.Header>
          <Table.HeaderRow>
            {visibleColumns.category && (
              <Table.HeaderCell
                css={{
                  width: columnWidths.category,
                  position: 'relative',
                  userSelect: 'none'
                }}>
                <ResizeHandle onMouseDown={e => startResizing('category', e)} />
                카테고리
              </Table.HeaderCell>
            )}
            {visibleColumns.title && (
              <Table.HeaderCell
                css={{
                  width: columnWidths.title,
                  position: 'relative',
                  userSelect: 'none'
                }}>
                <ResizeHandle onMouseDown={e => startResizing('title', e)} />
                제목
              </Table.HeaderCell>
            )}
            {visibleColumns.tags && (
              <Table.HeaderCell
                css={{
                  width: columnWidths.tags,
                  position: 'relative',
                  userSelect: 'none'
                }}>
                <ResizeHandle onMouseDown={e => startResizing('tags', e)} />
                태그
              </Table.HeaderCell>
            )}
            {visibleColumns.createdAt && (
              <Table.HeaderCell
                css={{
                  width: columnWidths.createdAt,
                  position: 'relative',
                  userSelect: 'none'
                }}>
                <ResizeHandle
                  onMouseDown={e => startResizing('createdAt', e)}
                />
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
            <Table.Row
              css={{
                height: '100vh',
                textAlign: 'center',
                padding: '40px',
                '&:hover': {
                  backgroundColor: 'transparent',
                  borderLeft: 'none'
                }
              }}>
              <Table.Cell colSpan={5}>
                <Flex
                  justify="center"
                  alignItems="center">
                  <LoadingDots />
                </Flex>
              </Table.Cell>
            </Table.Row>
          ) : posts.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={5}>데이터가 없어요</Table.Cell>
            </Table.Row>
          ) : (
            posts.map(post => {
              return (
                <Fragment key={post.id}>
                  <Table.Row
                    key={post.id}
                    onClick={() => handleRowClick(post.id)}>
                    {visibleColumns.category && (
                      <Table.Cell
                        css={{
                          width: columnWidths.category,
                          textAlign: 'center'
                        }}>
                        <Text
                          typography="caption"
                          color={colors.textPrimary}>
                          {post.category}
                        </Text>
                      </Table.Cell>
                    )}
                    {visibleColumns.title && (
                      <Table.Cell
                        css={{
                          width: columnWidths.title,
                          textAlign: 'center'
                        }}>
                        <Text
                          typography="body3"
                          color={colors.textPrimary}>
                          {post.title}
                        </Text>
                      </Table.Cell>
                    )}
                    {visibleColumns.tags && (
                      <Table.Cell
                        css={{
                          width: columnWidths.tags,
                          textAlign: 'center'
                        }}>
                        {post.tags.map(tag => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </Table.Cell>
                    )}
                    {visibleColumns.createdAt && (
                      <Table.Cell
                        css={{
                          width: columnWidths.createdAt,
                          wordBreak: 'break-word'
                        }}>
                        <Text
                          typography="body3"
                          color={colors.textPrimary}>
                          {formatTime(post.createdAt)}
                        </Text>
                      </Table.Cell>
                    )}
                    <Table.Cell
                      css={{
                        width: '100px',
                        wordBreak: 'break-word'
                      }}>
                      <Flex justify="space-around">
                        <Button
                          onClick={e => {
                            e.stopPropagation()
                            handleDeletePostClick({ postId: post.id })
                          }}>
                          삭제
                        </Button>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                </Fragment>
              )
            })
          )}
          {isFetchingNextPage && (
            <Table.Row>
              <Table.Cell
                css={{
                  textAlign: 'center',
                  padding: '20px',
                  color: colors.textSecondary
                }}
                colSpan={4}>
                <Flex
                  justify="center"
                  alignItems="center">
                  <LoadingDots />
                </Flex>
              </Table.Cell>
            </Table.Row>
          )}
          <InViewDetector
            onDetect={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
              }
            }}
          />
        </Table.Body>
      </Table>
    </>
  )
}

const ResizeHandle = styled.div`
  width: 10px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '⋮';
    color: #aaa;
    font-size: 14px;
  }

  &:hover::before {
    color: #555;
  }
`
