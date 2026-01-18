import { httpClient } from '@/utils/httpClient'

interface TopCoffeeBrand {
  brand: string
  popularity: number
}

// 바, 도넛 차트용 인기 커피 브랜드 분포 목업
export const fetchTopCoffeeBrands = () => {
  return httpClient.get<TopCoffeeBrand[]>('/mock/top-coffee-brands')
}

interface PopularSnackBrand {
  name: string
  share: number
}

// 바, 도넛 차트용 인기 간식 브랜드 분포 목업
export const fetchTopSnackBrands = () => {
  return httpClient.get<PopularSnackBrand[]>('/mock/popular-snack-brands')
}

interface WeeklyMoodTrend {
  week: string
  happy: number
  tired: number
  stressed: number
}

// 스택형 바/면적 차트용 주간 무드 트렌드 목업
export const fetchWeeklyMoodTrends = () => {
  return httpClient.get<WeeklyMoodTrend[]>('/mock/weekly-mood-trend')
}

interface WeeklyWorkoutTrend {
  week: string
  running: number
  cycling: number
  stretching: number
}

// 스택형 바/면적 차트용 주간 운동 트렌드 목업
export const fetchWeeklyWorkoutTrends = () => {
  return httpClient.get<WeeklyWorkoutTrend[]>('/mock/weekly-workout-trend')
}

interface CoffeeDataPoint {
  cups: number
  bugs: number
  productivity: number
}

// 멀티라인 차트용 팀별 커피 소비/버그/생산성 목업
export const fetchCoffeeConsumptions = () => {
  return httpClient.get<{
    teams: Array<{ team: string; series: CoffeeDataPoint[] }>
  }>('/mock/coffee-consumption')
}

interface SnackImpactDataPoint {
  snacks: number
  meetingsMissed: number
  morale: number
}

interface SnackImpactDepartment {
  name: string
  metrics: SnackImpactDataPoint[]
}

// 멀티라인 차트용 부서별 간식 영향 목업
export const fetchSnackImpacts = () => {
  return httpClient.get<{ departments: SnackImpactDepartment[] }>(
    '/mock/snack-impact'
  )
}
