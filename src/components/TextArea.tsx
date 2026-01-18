// components/Textarea.tsx
import { css } from '@emotion/react'
import { colors } from '@/constants/colors'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

export function Textarea({ label, ...props }: TextareaProps) {
  return (
    <div css={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label css={{ color: colors.textPrimary }}>{label}</label>}
      <textarea
        {...props}
        css={css`
          width: 100%;
          padding: 8px 12px;
          border: 1px solid ${colors.border};
          border-radius: 8px;
          background-color: ${colors.backgroundSecondary};
          color: ${colors.textPrimary};
          font-size: 14px;
          resize: vertical;
          box-sizing: border-box;

          &:focus {
            outline: none;
            border-color: ${colors.primary200};
          }
        `}
      />
    </div>
  )
}
