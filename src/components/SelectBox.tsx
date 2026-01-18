import { css } from '@emotion/react'
import { useState, useRef, useEffect } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { colors } from '@/constants/colors'
import { fontSize } from '@/constants/font'

export interface SelectBoxOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectBoxProps {
  options: SelectBoxOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  error?: boolean
  id?: string
  className?: string
}

export function SelectBox({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  error = false,
  id,
  className
}: SelectBoxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (isOpen && highlightedIndex >= 0) {
          const option = options[highlightedIndex]
          if (!option.disabled) {
            onChange?.(option.value)
            setIsOpen(false)
            setHighlightedIndex(-1)
          }
        } else {
          setIsOpen(true)
        }
        break
      case 'ArrowDown':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          const nextIndex =
            highlightedIndex < options.length - 1 ? highlightedIndex + 1 : 0
          setHighlightedIndex(nextIndex)
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!isOpen) {
          setIsOpen(true)
        } else {
          const prevIndex =
            highlightedIndex > 0 ? highlightedIndex - 1 : options.length - 1
          setHighlightedIndex(prevIndex)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  const handleToggle = () => {
    if (disabled) return
    setIsOpen(!isOpen)
    if (!isOpen) {
      setHighlightedIndex(-1)
    }
  }

  const handleOptionClick = (option: SelectBoxOption) => {
    if (option.disabled) return
    onChange?.(option.value)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  return (
    <div
      ref={containerRef}
      css={containerStyle}
      className={className}>
      <div
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${id || 'selectbox'}-options`}
        aria-labelledby={id ? `${id}-label` : undefined}
        tabIndex={disabled ? -1 : 0}
        css={selectStyle({ disabled, error, isOpen })}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}>
        <span css={valueStyle({ hasValue: Boolean(selectedOption) })}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div>
          {isOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
        </div>
      </div>

      {isOpen && (
        <div
          ref={optionsRef}
          id={`${id || 'selectbox'}-options`}
          role="listbox"
          css={dropdownStyle}>
          {options.map((option, index) => (
            <div
              key={option.value}
              role="option"
              aria-selected={option.value === value}
              css={optionStyle({
                disabled: option.disabled || false,
                highlighted: index === highlightedIndex,
                selected: option.value === value
              })}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => setHighlightedIndex(index)}>
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const containerStyle = css`
  position: relative;
  display: inline-block;
`

const selectStyle = ({
  disabled,
  error,
  isOpen
}: {
  disabled: boolean
  error: boolean
  isOpen: boolean
}) => css`
  padding: 0px 16px 0px 16px;
  border: 1px solid
    ${error ? colors.badgeCritical : isOpen ? colors.primary500 : colors.border};
  border-radius: 8px;
  font-size: ${fontSize.body3};
  background-color: ${disabled ? colors.backgroundSecondary : colors.white};
  outline: none;
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 36px;
  min-width: 100px;

  ${isOpen &&
  !disabled &&
  !error &&
  `
    border-color: ${colors.primary500};
    box-shadow: 0 0 0 3px ${colors.primary100};
  `}

  ${!disabled &&
  !error &&
  !isOpen &&
  `
    &:hover {
      border-color: ${colors.borderHover};
    }
  `}

  ${disabled &&
  `
    opacity: 0.6;
  `}

  &:focus {
    outline: none;
    ${!error &&
    `
      border-color: ${colors.primary500};
      box-shadow: 0 0 0 3px ${colors.primary100};
    `}
  }
`

const valueStyle = ({ hasValue }: { hasValue: boolean }) => css`
  color: ${hasValue ? colors.textPrimary : colors.textSecondary};
  flex: 1;
  text-align: left;
  padding-right: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const dropdownStyle = css`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 1000;
  background-color: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  box-shadow:
    0 4px 6px -1px ${colors.boxShadow},
    0 2px 4px -1px ${colors.boxShadow};
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  width: 100%;
`

const optionStyle = ({
  disabled,
  highlighted,
  selected
}: {
  disabled: boolean
  highlighted: boolean
  selected: boolean
}) => css`
  padding: 8px 12px;
  font-size: ${fontSize.body3};
  color: ${disabled ? colors.textSecondary : colors.textPrimary};
  cursor: ${disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${highlighted &&
  !disabled &&
  `
    background-color: ${colors.primary50};
  `}

  ${selected &&
  `
    background-color: ${colors.primary100};
    color: ${colors.primary600};
    font-weight: 600;
  `}
  
  ${!disabled &&
  `
    &:hover {
      background-color: ${selected ? colors.primary100 : colors.primary50};
    }
  `}
  
  ${disabled &&
  `
    opacity: 0.5;
  `}
`
