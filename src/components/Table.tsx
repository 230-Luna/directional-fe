import { colors } from '@/constants/colors'
import { css } from '@emotion/react'
import type { ComponentProps, ReactNode } from 'react'
import { Flex } from './Flex'
import { LoadingDots } from './LoadingDots'
import styled from '@emotion/styled'
import type React from 'react'

type TableSize = 'sm' | 'md' | 'lg'

interface TableProps extends Omit<ComponentProps<'table'>, 'ref'> {
  size?: TableSize
  children: ReactNode
  infiniteScroll?: boolean
  ref?: React.RefObject<HTMLDivElement | null>
}

interface TableHeaderProps extends ComponentProps<'thead'> {
  children: ReactNode
}

interface TableBodyProps extends ComponentProps<'tbody'> {
  children: ReactNode
}

interface TableRowProps extends ComponentProps<'tr'> {
  children: ReactNode
}

interface TableHeaderRowProps extends ComponentProps<'tr'> {
  children: ReactNode
}

interface TableHeaderCellProps extends ComponentProps<'th'> {
  children: ReactNode
  size?: TableSize
  resizable?: boolean
  onResizeHandlerMouseDown?: (e: React.MouseEvent) => void
}

interface TableCellProps extends ComponentProps<'td'> {
  children: ReactNode
  size?: TableSize
}

function TableComponent({
  size = 'md',
  infiniteScroll = false,
  children,
  ref,
  ...props
}: TableProps) {
  return (
    <div
      css={tableContainerStyle({ infiniteScroll })}
      ref={ref}>
      <table
        css={tableStyle({ size })}
        {...props}>
        {children}
      </table>
    </div>
  )
}

function TableHeader({ children, ...props }: TableHeaderProps) {
  return <thead {...props}>{children}</thead>
}

function TableBody({ children, ...props }: TableBodyProps) {
  return <tbody {...props}>{children}</tbody>
}

function TableRow({ children, ...props }: TableRowProps) {
  return (
    <tr
      css={tableRowStyle}
      {...props}>
      {children}
    </tr>
  )
}

function TableHeaderRow({ children, ...props }: TableHeaderRowProps) {
  return <tr {...props}>{children}</tr>
}

function TableHeaderCell({
  children,
  size = 'md',
  resizable,
  onResizeHandlerMouseDown,
  ...props
}: TableHeaderCellProps) {
  return (
    <th
      css={tableHeaderCellStyle({ size })}
      {...props}>
      {resizable ? (
        <ResizeHandle onMouseDown={onResizeHandlerMouseDown} />
      ) : null}
      {children}
    </th>
  )
}

function TableCell({ children, size = 'md', ...props }: TableCellProps) {
  return (
    <td
      css={tableCellStyle({ size })}
      {...props}>
      {children}
    </td>
  )
}

function TableLoadingRow({ colSpan }: { colSpan?: number }) {
  return (
    <Table.Row>
      <Table.Cell
        css={{
          textAlign: 'center',
          padding: '20px',
          color: colors.textSecondary
        }}
        colSpan={colSpan}>
        <Flex
          justify="center"
          alignItems="center">
          <LoadingDots />
        </Flex>
      </Table.Cell>
    </Table.Row>
  )
}

const tableContainerStyle = ({
  infiniteScroll = false
}: {
  infiniteScroll?: boolean
}) => css`
  width: 100%;
  overflow-x: auto;
  scroll-behavior: smooth;

  ${infiniteScroll &&
  css`
    position: relative;
    max-height: 70vh;
    overflow-y: auto;

    /* x축 스크롤바를 항상 보이도록 설정 */
    &::-webkit-scrollbar:horizontal {
      height: 12px;
      position: sticky;
      bottom: 0;
    }

    &::-webkit-scrollbar-track:horizontal {
      background: ${colors.backgroundLight};
      border-radius: 6px;
    }

    &::-webkit-scrollbar-thumb:horizontal {
      background: ${colors.primary300};
      border-radius: 6px;
    }

    &::-webkit-scrollbar-thumb:horizontal:hover {
      background: ${colors.primary500};
    }

    /* Firefox용 스크롤바 스타일 */
    scrollbar-width: thin;
    scrollbar-color: ${colors.primary300} ${colors.backgroundLight};
  `}
`

const tableStyle = ({ size }: { size: TableSize }) => css`
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  font-size: ${getSizeStyles(size).fontSize};
  border-radius: 8px;
  overflow: hidden;
`

const tableRowStyle = css`
  position: relative;
  border-left: 4px solid transparent;

  &:hover {
    background-color: ${colors.primary50};
    border-left: 4px solid ${colors.primary500};
    border-radius: 4px;
  }

  &:last-child {
    border-bottom: none;
  }
`

const getSizeStyles = (size: TableSize) => {
  switch (size) {
    case 'sm':
      return { padding: '8px 12px', fontSize: '12px' }
    case 'lg':
      return { padding: '16px 20px', fontSize: '16px' }
    default:
      return { padding: '12px 16px', fontSize: '14px' }
  }
}

const tableHeaderCellStyle = ({ size = 'md' }: { size?: TableSize }) => css`
  padding: ${getSizeStyles(size).padding};
  text-align: center;
  font-weight: 600;
  font-size: ${getSizeStyles(size).fontSize};
  color: ${colors.textSecondary};
  border-bottom: 1px solid ${colors.border};
  white-space: nowrap;
  letter-spacing: 0.025em;
`

const tableCellStyle = ({ size = 'md' }: { size?: TableSize }) => css`
  padding: ${getSizeStyles(size).padding};
  text-align: center;
  font-size: ${getSizeStyles(size).fontSize};
  color: ${colors.textPrimary};
  border-bottom: 1px solid ${colors.border};
  vertical-align: middle;
`

const ResizeHandle = styled.div`
  width: 10px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '⋮';
    color: #aaa;
    font-size: 14px;
  }

  &:hover::before {
    color: #555;
  }
`

const Table = Object.assign(TableComponent, {
  Header: TableHeader,
  Body: TableBody,
  Row: TableRow,
  LoadingRow: TableLoadingRow,
  HeaderRow: TableHeaderRow,
  HeaderCell: TableHeaderCell,
  Cell: TableCell
})

export { Table }
