import { overlay } from 'overlay-kit'
import { PostDialog } from '@/pages/home/components/PostDialog'
import type { Category } from '@/pages/home/models/post'

export const usePostDialog = () => {
  return {
    open: (defaultValues?: {
      title: string
      body: string
      tags: string
      category: Category
    }) => {
      return new Promise<{
        title: string
        body: string
        tags: string[]
        category: Category
      } | null>(resolve => {
        overlay.open(({ isOpen, close }) => (
          <PostDialog
            open={isOpen}
            defaultValues={defaultValues}
            readOnly={!!defaultValues}
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
