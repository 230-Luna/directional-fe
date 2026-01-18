import { css } from '@emotion/react'
import { FaSearch } from 'react-icons/fa'
import { Flex } from './Flex'
import { colors } from '@/constants/colors'
import type { ChangeEvent, InputHTMLAttributes } from 'react'
import { Input } from './Input'

interface SearchBarProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  value: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  width?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search...',
  width = '224px',

  ...props
}: SearchBarProps) {
  return (
    <Flex
      alignItems="center"
      css={searchBarContainer(width)}>
      <div css={searchIconStyle}>
        <FaSearch
          size={16}
          color={colors.textSecondary}
        />
      </div>
      <Input
        type="input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        css={{ paddingLeft: '36px', width: '100%' }}
        {...props}
      />
    </Flex>
  )
}

const searchBarContainer = (width: string) => css`
  position: relative;
  width: ${width};
  box-sizing: border-box;
`

const searchIconStyle = css`
  position: absolute;
  left: 12px;
  z-index: 1;
  display: flex;
  align-items: center;
  pointer-events: none;
`
