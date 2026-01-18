import { colors } from '@/constants/colors'
import { fontSize } from '@/constants/font'
import type { ComponentProps } from 'react'

type Typography = keyof typeof fontSize

interface TextProps extends ComponentProps<'span'> {
  typography?: Typography
  color?: string
  bold?: boolean
  nowrap?: boolean
}

export function Text({
  children,
  typography = 'body2',
  color = colors.textPrimary,
  bold = false,
  nowrap = false,
  ...props
}: TextProps) {
  const style = {
    color,
    fontSize: fontSize[typography],
    fontWeight: bold ? 'bold' : 'normal',
    lineHeight: '1.4',
    overflow: nowrap ? 'hidden' : 'visible',
    textOverflow: 'ellipsis',
    whiteSpace: nowrap ? 'nowrap' : 'normal'
  }
  return (
    <span
      css={{ ...style }}
      {...props}>
      {children}
    </span>
  )
}
