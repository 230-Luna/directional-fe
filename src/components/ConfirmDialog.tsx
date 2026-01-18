import { Spacing } from './Spacing'
import { Text } from './Text'
import { css } from '@emotion/react'
import { Button } from './Button'
import { Flex } from './Flex'
import { colors } from '@/constants/colors'

interface ConfirmDialogProps {
  content?: string
  open: boolean
  onConfirm: () => void
  onClose: () => void
  rejectButtonText: string
  confirmButtonText: string
}

export function ConfirmDialog({
  content,
  open,
  onConfirm,
  onClose,
  rejectButtonText = '취소',
  confirmButtonText = '확인'
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div css={overlayStyle}>
      <div css={dialogStyle}>
        <Spacing size={36} />
        <Flex justify="center">
          <Text>{content}</Text>
        </Flex>
        <Spacing size={36} />
        <Flex
          gap={40}
          justify="center">
          <Button
            onClick={onClose}
            css={{
              backgroundColor: colors.primary300
            }}>
            {rejectButtonText}
          </Button>
          <Button onClick={onConfirm}>{confirmButtonText}</Button>
        </Flex>
      </div>
    </div>
  )
}

const overlayStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`

const dialogStyle = css`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: ${colors.backgroundPrimary};
  padding: 24px;
  border-radius: 16px;
  width: 500px;
  max-width: 50vw;
`
