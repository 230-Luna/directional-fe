import { colors } from '@/constants/colors'
import { fontSize } from '@/constants/font'
import { css } from '@emotion/react'
import type { ComponentProps, ReactNode } from 'react'

export interface TagProps extends ComponentProps<'span'> {
  children: ReactNode
  close?: boolean
  onClose?: () => void
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Tag({
  children,
  close = false,
  onClose,
  leftIcon,
  rightIcon,
  ...props
}: TagProps) {
  return (
    <span
      css={tagStyle}
      {...props}>
      {leftIcon && <span css={iconStyle}>{leftIcon}</span>}
      <span css={labelStyle}>{children}</span>
      {rightIcon && <span css={iconStyle}>{rightIcon}</span>}
      {close && (
        <button
          type="button"
          css={closeButtonStyle}
          onClick={onClose}>
          ×
        </button>
      )}
    </span>
  )
}

const tagStyle = css`
  background-color: ${colors.tagBackground};
  color: ${colors.tagText};
  padding: 2px 8px;
  border-radius: 16px;
  border: 1px solid ${colors.border};
  font-size: ${fontSize.label};
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

const iconStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
`

const labelStyle = css`
  flex: 1;
`

const closeButtonStyle = css`
  background: none;
  border: none;
  color: ${colors.tagCloseButton};
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
  font-size: ${fontSize.body3};
  line-height: 1;
  font-weight: bold;

  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: none;
    opacity: 1;
  }
`
