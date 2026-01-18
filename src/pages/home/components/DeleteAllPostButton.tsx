import { deletePosts } from '@/pages/home/apis/posts'
import { Button } from '@/components/Button'
import { useConfirmDialog } from '@/hooks/useConfirmDialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function DeleteAllPostButton() {
  const queryClient = useQueryClient()
  const confirmDialog = useConfirmDialog()

  const handleButtonClick = useMutation({
    mutationFn: async () => {
      try {
        const confirmed = await confirmDialog.open({
          content: '모든 포스트를 삭제하시겠습니까?',
          confirmButtonText: '확인',
          rejectButtonText: '취소'
        })

        if (!confirmed) {
          return
        }

        const deleteResponse = await deletePosts()

        if (deleteResponse.ok) {
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
  })

  return (
    <Button
      onClick={() => handleButtonClick.mutate()}
      loading={handleButtonClick.isPending}>
      전체 삭제
    </Button>
  )
}
