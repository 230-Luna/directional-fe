/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react'

function Root({ children }: { children: ReactNode }) {
  return (
    <section style={{ marginTop: 12, display: 'flex', gap: 12 }}>
      🎨 {children}
    </section>
  )
}

function Item({
  value,
  onChange,
  title
}: {
  value: string | undefined
  onChange: (value: string) => void
  title: string
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        marginBottom: 4
      }}>
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          border: 'none',
          outline: 'none',
          padding: 0,
          backgroundColor: 'transparent',
          width: 24,
          height: 24,
          cursor: 'pointer'
        }}
      />
      <span style={{ fontSize: 12 }}>{title}</span>
    </div>
  )
}

export const ColorPicker = {
  Root,
  Item
}
