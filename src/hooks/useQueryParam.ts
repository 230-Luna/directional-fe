import { useSearchParams } from 'react-router'

interface Options<T> {
  parser?: (val: string) => T
  required?: boolean
}

export function useQueryParam<T = string>(name: string): T | undefined
export function useQueryParam<T = string>(
  name: string,
  options: Options<T> & { required: true }
): T
export function useQueryParam<T = string>(
  name: string,
  options: Options<T>
): T | undefined
export function useQueryParam<T = string>(name: string, option?: Options<T>) {
  const [searchParams] = useSearchParams()
  const value = searchParams.get(name)

  if (option?.required === true && value == null) {
    throw new Error('쿼리 파라미터가 없어요')
  }

  if (option?.parser != null && value != null) {
    return option.parser(value)
  } else {
    return value
  }
}
