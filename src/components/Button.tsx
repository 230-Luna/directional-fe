import { noop } from '@/utils/function'
import { css, keyframes } from '@emotion/react'
import type { ComponentProps } from 'react'
import { Text } from './Text'
import { colors } from '@/constants/colors'

export interface ButtonProps extends ComponentProps<'button'> {
  loading?: boolean
  disableHover?: boolean
  variant?: 'primary' | 'secondary' | 'icon' | 'danger'
}

export function Button({
  children,
  loading = false,
  onClick,
  disableHover = false,
  variant = 'primary',
  ...props
}: ButtonProps) {
  return (
    <button
      onClick={loading ? noop : onClick}
      css={
        variant === 'primary'
          ? primaryButtonStyle({
              disabled: props.disabled ?? false,
              loading,
              disableHover
            })
          : variant === 'secondary'
            ? secondaryButtonStyle({
                disabled: props.disabled ?? false,
                loading,
                disableHover
              })
            : variant === 'danger'
              ? dangerButtonStyle({
                  disabled: props.disabled ?? false,
                  loading,
                  disableHover
                })
              : iconButtonStyle()
      }
      {...props}>
      {loading ? (
        <Spinner />
      ) : (
        <Text
          typography="body2"
          color={
            variant === 'primary' || variant === 'danger'
              ? colors.white
              : variant === 'secondary'
                ? colors.primary600
                : colors.textSecondary
          }>
          {children}
        </Text>
      )}
    </button>
  )
}

const primaryButtonStyle = ({
  disabled,
  loading,
  disableHover
}: {
  disabled: boolean
  loading: boolean
  disableHover: boolean
}) => css`
  color: ${colors.white};
  max-height: 48px;
  height: 48px;
  width: auto;
  border-radius: 8px;
  padding: 8px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${disabled || loading
    ? colors.primary400
    : colors.primary500};
  text-align: center;
  font-weight: bold;
  border: none;
  cursor: ${disabled || loading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  ${!disableHover &&
  `&:hover {
    background-color: ${
      disabled || loading ? colors.primary300 : colors.primary600
    };
  }`}
  ${!disabled &&
  !loading &&
  `&:active {
    transform: scale(0.95);
  }`}
`

const secondaryButtonStyle = ({
  disabled,
  loading,
  disableHover
}: {
  disabled: boolean
  loading: boolean
  disableHover: boolean
}) => css`
  color: ${colors.primary600};
  max-height: 48px;
  height: 48px;
  width: auto;
  border-radius: 8px;
  padding: 8px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${colors.primary200};
  background-color: ${disabled || loading
    ? colors.primary50
    : colors.primary100};
  text-align: center;
  font-weight: bold;
  cursor: ${disabled || loading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  ${!disableHover &&
  `&:hover {
    background-color: ${
      disabled || loading ? colors.primary50 : colors.primary200
    };
    border-color: ${colors.primary300};
  }`}
  ${!disabled &&
  !loading &&
  `&:active {
    transform: scale(0.95);
  }`}
`

const iconButtonStyle = () => css`
  background: transparent;
  border: transparent;
  cursor: pointer;
  color: ${colors.textSecondary};
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  &:hover {
    background-color: ${colors.backgroundHover};
  }
  &:active {
    transform: scale(0.95);
  }
`

const dangerButtonStyle = ({
  disabled,
  loading,
  disableHover
}: {
  disabled: boolean
  loading: boolean
  disableHover: boolean
}) => css`
  color: ${colors.white};
  max-height: 48px;
  height: 48px;
  width: auto;
  border-radius: 8px;
  padding: 8px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${disabled || loading
    ? colors.dangerDisabled
    : colors.danger};
  text-align: center;
  font-weight: bold;
  border: none;
  cursor: ${disabled || loading ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  ${!disableHover &&
  `&:hover {
    background-color: ${
      disabled || loading ? colors.dangerDisabled : colors.danger
    };
  }`}
  ${!disabled &&
  !loading &&
  `&:active {
    transform: scale(0.95);
  }`}
`

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Spinner = () => (
  <div
    css={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      maxHeight: '100%'
    }}>
    <div
      css={{
        width: '14px',
        height: '14px',
        border: '2px solid white',
        borderTopColor: 'transparent',
        borderRadius: '50%',
        animation: `${spin} 0.6s linear infinite`
      }}
    />
    <span css={{ marginLeft: 8 }} />
  </div>
)
