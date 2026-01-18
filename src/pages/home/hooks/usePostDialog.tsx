import { overlay } from 'overlay-kit'
import { PostDialog } from '@/pages/home/components/PostDialog'
import type { Category } from '@/pages/home/models/post'

export const usePostDialog = () => {
  return {
    open: ({
      dialogTitle,
      defaultValues,
      readOnly
    }: {
      dialogTitle: string
      defaultValues?: {
        title: string
        body: string
        tags: string
        category: Category
      }
      readOnly?: boolean
    }) => {
      return new Promise<{
        title: string
        body: string
        tags: string[]
        category: Category
      } | null>(resolve => {
        overlay.open(({ isOpen, close }) => (
          <PostDialog
            dialogTitle={dialogTitle}
            open={isOpen}
            defaultValues={defaultValues}
            readOnly={readOnly}
            onClose={() => {
              resolve(null)
              close()
            }}
            onSubmit={data => {
              resolve(data)
              close()
            }}
          />
        ))
      })
    }
  }
}
