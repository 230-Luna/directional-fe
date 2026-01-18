import {
  fetchTopCoffeeBrands,
  fetchTopSnackBrands,
  fetchWeeklyMoodTrends,
  fetchWeeklyWorkoutTrends,
  fetchCoffeeConsumptions,
  fetchSnackImpacts
} from '@/apis/chart'
import { queryOptions } from '@tanstack/react-query'

export const getTopCoffeeBrandsQueryOptions = () =>
  queryOptions({
    queryKey: ['fetchTopCoffeeBrands'],
    queryFn: () => fetchTopCoffeeBrands()
  })

export const getTopSnackBrandsQueryOptions = () =>
  queryOptions({
    queryKey: ['fetchTopSnackBrands'],
    queryFn: () => fetchTopSnackBrands()
  })

export const getWeeklyMoodTrendsQueryOptions = () =>
  queryOptions({
    queryKey: ['fetchWeeklyMoodTrends'],
    queryFn: () => fetchWeeklyMoodTrends()
  })

export const getWeeklyWorkoutTrendsQueryOptions = () =>
  queryOptions({
    queryKey: ['fetchWeeklyWorkoutTrends'],
    queryFn: () => fetchWeeklyWorkoutTrends()
  })

export const getCoffeeConsumptionsQueryOptions = () =>
  queryOptions({
    queryKey: ['fetchCoffeeConsumptions'],
    queryFn: () => fetchCoffeeConsumptions()
  })

export const getSnackImpactsQueryOptions = () =>
  queryOptions({
    queryKey: ['fetchSnackImpacts'],
    queryFn: () => fetchSnackImpacts()
  })
