import { ConfirmDialog } from '@/components/ConfirmDialog'
import { overlay } from 'overlay-kit'

export const useConfirmDialog = () => {
  return {
    open: ({
      content,
      rejectButtonText,
      confirmButtonText
    }: {
      content: string
      rejectButtonText: string
      confirmButtonText: string
    }) => {
      return new Promise<boolean>(resolve => {
        overlay.open(({ isOpen, close }) => (
          <ConfirmDialog
            content={content}
            open={isOpen}
            onClose={() => {
              resolve(false)
              close()
            }}
            onConfirm={() => {
              resolve(true)
              close()
            }}
            rejectButtonText={rejectButtonText}
            confirmButtonText={confirmButtonText}
          />
        ))
      })
    }
  }
}
