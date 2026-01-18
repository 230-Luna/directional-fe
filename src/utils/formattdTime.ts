import { format, parseISO } from 'date-fns'

export const formatTime = (value: string) => {
  try {
    const date = parseISO(String(value))
    return format(date, 'yyyy/MM/dd HH:mm:ss')
  } catch {
    return String(value)
  }
}
