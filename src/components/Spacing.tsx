export function Spacing({ size }: { size: number | string }) {
  return (
    <div
      css={{
        flex: 'none',
        width: '100%',
        height: typeof size === 'number' ? `${size}px` : size
      }}
    />
  )
}
