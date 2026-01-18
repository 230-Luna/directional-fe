import { Table } from '@/components/Table'
import { Text } from '@/components/Text'
import { colors } from '@/constants/colors'
import type { ReactNode } from 'react'

export function PostTableCell({
  width,
  children
}: {
  width: number
  children: ReactNode
}) {
  return (
    <Table.Cell
      css={{
        width,
        textAlign: 'center'
      }}>
      <Text
        typography="body3"
        color={colors.textPrimary}>
        {children}
      </Text>
    </Table.Cell>
  )
}
