import { css } from '@emotion/react'
import type { ChangeEvent, InputHTMLAttributes } from 'react'
import { Text } from './Text'
import { colors } from '@/constants/colors'
import { fontSize } from '@/constants/font'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  value?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  type?: string
  label?: string
}

export function Input({
  value,
  onChange,
  placeholder,
  type,
  label,
  ...props
}: InputProps) {
  return (
    <label css={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {label && (
        <Text
          typography="body3"
          color={colors.textPrimary}
          css={{ whiteSpace: 'nowrap' }}>
          {label}
        </Text>
      )}

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        css={inputStyle}
        {...props}
      />
    </label>
  )
}

const inputStyle = css`
  padding: 10px 16px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: ${fontSize.body3};
  color: ${colors.textPrimary};
  background-color: ${colors.white};
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${colors.primary500};
    box-shadow: 0 0 0 3px ${colors.primary100};
  }

  &::placeholder {
    color: ${colors.textSecondary};
  }

  &:hover {
    border-color: ${colors.borderHover};
  }
`
