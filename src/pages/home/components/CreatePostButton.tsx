import { usePostDialog } from '@/pages/home/hooks/usePostDialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FORBIDDEN_WORDS } from '../constants/forbidden-word'
import { createPosts } from '@/pages/home/apis/posts'
import { Button } from '@/components/Button'

export function CreatePostButton() {
  const queryClient = useQueryClient()
  const postDialog = usePostDialog()

  const handleButtonClick = useMutation({
    mutationFn: async () => {
      try {
        const data = await postDialog.open()
        if (!data) return

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

  return (
    <Button
      onClick={() => handleButtonClick.mutate()}
      disabled={handleButtonClick.isPending}>
      새 글 작성
    </Button>
  )
}
