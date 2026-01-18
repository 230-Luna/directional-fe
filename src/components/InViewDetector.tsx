import { useEffect, useRef } from 'react'

export function InViewDetector({ onDetect }: { onDetect: () => void }) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bottomRef.current) return

    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        onDetect()
      }
    })

    observer.observe(bottomRef.current)
    return () => observer.disconnect()
  }, [onDetect])

  return (
    <div
      ref={bottomRef}
      style={{ height: 1 }}
    />
  )
}
