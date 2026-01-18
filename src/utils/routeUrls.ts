import queryString from 'query-string'

export const RouteUrls = {
  HOME: (params: {
    searchWord?: string
    category?: string
    sortBy?: string
    orderBy?: string
  }) => `?${queryString.stringify(params, { skipNull: true })}`
}
