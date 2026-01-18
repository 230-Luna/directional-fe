import { deletePost } from '@/pages/home/apis/posts'
import { Button } from '@/components/Button'
import { useConfirmDialog } from '@/hooks/useConfirmDialog'
import type { Post } from '@/pages/home/models/post'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function PostDeleteButton({ post }: { post: Post }) {
  const confirmDialog = useConfirmDialog()
  const queryClient = useQueryClient()

  const handleButtonClick = useMutation({
    mutationFn: async ({ postId }: { postId: string }) => {
      try {
        const confirmed = await confirmDialog.open({
          content: '포스트를 삭제하시겠습니까?',
          confirmButtonText: '확인',
          rejectButtonText: '취소'
        })

        if (!confirmed) {
          return
        }

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
  })

  return (
    <Button
      onClick={e => {
        e.stopPropagation()
        handleButtonClick.mutate({ postId: post.id })
      }}
      loading={handleButtonClick.isPending}>
      삭제
    </Button>
  )
}
