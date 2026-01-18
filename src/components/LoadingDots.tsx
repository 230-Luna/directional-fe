import { colors } from '@/constants/colors'
import { css, keyframes } from '@emotion/react'

const fade = keyframes`
  0%, 80%, 100% { opacity: 0.2; }
  40% { opacity: 1; }
`

const dotStyle = (delay: string) => css`
  width: 12px;
  height: 12px;
  margin: 0 4px;
  background-color: ${colors.primary900};
  border-radius: 50%;
  display: inline-block;
  animation: ${fade} 1.2s infinite;
  animation-delay: ${delay};
`

export function LoadingDots() {
  return (
    <div
      css={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span css={dotStyle('0s')} />
      <span css={dotStyle('0.2s')} />
      <span css={dotStyle('0.4s')} />
    </div>
  )
}
