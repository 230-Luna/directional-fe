import { css } from '@emotion/react'
import type { ChangeEvent, InputHTMLAttributes } from 'react'
import { Text } from './Text'
import { colors } from '@/constants/colors'
import { fontSize } from '@/constants/font'
import { Flex } from './Flex'

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
    <Flex
      gap={8}
      alignContent="center">
      <div>
        {label && (
          <label htmlFor={value}>
            <Text
              typography="body3"
              color={colors.textPrimary}>
              {label}
            </Text>
          </label>
        )}
      </div>
      <input
        id={value}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        css={inputStyle}
        {...props}
      />
    </Flex>
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
