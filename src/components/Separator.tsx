import { colors } from '../constants/colors'

export interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  thickness?: number | string
  color?: string
  length?: number | string
  margin?: number | string
}

export function Separator({
  orientation = 'horizontal',
  thickness = 1,
  color = colors.border,
  length = '100%',
  margin = 0,
  ...props
}: SeparatorProps) {
  const isHorizontal = orientation === 'horizontal'
  return (
    <div
      css={{
        backgroundColor: color,
        width: isHorizontal ? length : thickness,
        height: isHorizontal ? thickness : length,
        margin: isHorizontal ? `${margin}px 0` : `0 ${margin}px`,
        borderRadius: thickness
      }}
      {...props}
    />
  )
}
