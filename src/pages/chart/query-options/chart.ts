import {
  fetchTopCoffeeBrands,
  fetchTopSnackBrands,
  fetchWeeklyMoodTrends,
  fetchWeeklyWorkoutTrends,
  fetchCoffeeConsumptions,
  fetchSnackImpacts
} from '@/pages/chart/apis/chart'
import { queryOptions } from '@tanstack/react-query'

export const fetchTopCoffeeBrandsQueryOptions = () =>
  queryOptions({
    queryKey: ['fetchTopCoffeeBrands'],
    queryFn: () => fetchTopCoffeeBrands()
  })

export const fetchTopSnackBrandsQueryOptions = () =>
  queryOptions({
    queryKey: ['fetchTopSnackBrands'],
    queryFn: () => fetchTopSnackBrands()
  })

export const fetchWeeklyMoodTrendsQueryOptions = () =>
  queryOptions({
    queryKey: ['fetchWeeklyMoodTrends'],
    queryFn: () => fetchWeeklyMoodTrends()
  })

export const fetchWeeklyWorkoutTrendsQueryOptions = () =>
  queryOptions({
    queryKey: ['fetchWeeklyWorkoutTrends'],
    queryFn: () => fetchWeeklyWorkoutTrends()
  })

export const fetchCoffeeConsumptionsQueryOptions = () =>
  queryOptions({
    queryKey: ['fetchCoffeeConsumptions'],
    queryFn: () => fetchCoffeeConsumptions()
  })

export const fetchSnackImpactsQueryOptions = () =>
  queryOptions({
    queryKey: ['fetchSnackImpacts'],
    queryFn: () => fetchSnackImpacts()
  })
