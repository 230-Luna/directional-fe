import type { ComponentProps, CSSProperties, ReactNode } from 'react'

interface FlexProps extends ComponentProps<'div'> {
  children?: ReactNode
  alignItems?: CSSProperties['alignItems']
  alignContent?: CSSProperties['alignContent']
  justify?: CSSProperties['justifyContent']
  direction?: CSSProperties['flexDirection']
  wrap?: CSSProperties['flexWrap']
  gap?: CSSProperties['gap']
}

export function Flex({
  children,
  alignItems,
  alignContent,
  justify,
  direction,
  wrap,
  gap,
  ...props
}: FlexProps) {
  return (
    <div
      css={{
        display: 'flex',
        flexDirection: direction,
        alignItems,
        alignContent,
        justifyContent: justify,
        flexWrap: wrap,
        gap
      }}
      {...props}>
      {children}
    </div>
  )
}
