import { Button } from '@/components/Button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Post } from '../models/post'
import { usePostDialog } from '../hooks/usePostDialog'
import { updatePostById } from '../apis/posts'

export function PostEditButton({ post }: { post: Post }) {
  const postDialog = usePostDialog()
  const queryClient = useQueryClient()

  const handleButtonClick = useMutation({
    mutationFn: async () => {
      try {
        const editedPost = await postDialog.open({
          dialogTitle: '게시글 수정',
          defaultValues: {
            title: post.title,
            body: post.body,
            tags: post.tags.join(','),
            category: post.category
          }
        })

        if (editedPost == null) {
          return
        }

        await updatePostById({ id: post.id, post: editedPost })

        alert('게시글이 수정 되었습니다!')
        queryClient.invalidateQueries({
          queryKey: ['fetchPosts'],
          exact: false
        })
      } catch (error) {
        console.error(error)
        alert('글 수정 중 오류가 발생했습니다.')
      }
    }
  })

  return (
    <Button
      onClick={e => {
        e.stopPropagation()
        handleButtonClick.mutate()
      }}
      loading={handleButtonClick.isPending}>
      수정
    </Button>
  )
}
