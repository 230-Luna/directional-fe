import {
  DonutChart,
  MultiLineChart,
  StackedChart,
  BarChart
} from './components/charts'
import {
  getCoffeeConsumptionsQueryOptions,
  getSnackImpactsQueryOptions,
  getTopSnackBrandsQueryOptions,
  getWeeklyMoodTrendsQueryOptions,
  getWeeklyWorkoutTrendsQueryOptions
} from './query-options/chart'
import { useSuspenseQueries } from '@tanstack/react-query'
import { Suspense } from 'react'

export function ChartPage() {
  return (
    <Suspense>
      <PageComponent />
    </Suspense>
  )
}

function PageComponent() {
  const [
    { data: weeklyMoodeTrends },
    { data: topSnackBrands },
    { data: weeklyWorkoutTrends },
    { data: snackImpacts },
    { data: coffeeConsumptions }
  ] = useSuspenseQueries({
    queries: [
      getWeeklyMoodTrendsQueryOptions(),
      getTopSnackBrandsQueryOptions(),
      getWeeklyWorkoutTrendsQueryOptions(),
      getSnackImpactsQueryOptions(),
      getCoffeeConsumptionsQueryOptions()
    ]
  })

  return (
    <div style={{ padding: 24 }}>
      <h1>데이터 시각화 과제</h1>

      <h3>(1) `/mock/weekly-mood-trend` 바/도넛 차트</h3>
      <BarChart
        labels={weeklyMoodeTrends.map(trend => trend.week)}
        series={[
          {
            name: 'happy',
            data: weeklyMoodeTrends.map(trend => trend.happy)
          },
          {
            name: 'tired',
            data: weeklyMoodeTrends.map(trend => trend.tired)
          },
          {
            name: 'stressed',
            data: weeklyMoodeTrends.map(trend => trend.stressed)
          }
        ]}
      />

      <DonutChart
        series={weeklyMoodeTrends.map(weeklyMood => ({
          id: weeklyMood.week,
          data: [
            { name: 'happy', value: weeklyMood.happy },
            { name: 'tired', value: weeklyMood.tired },
            { name: 'stressed', value: weeklyMood.stressed }
          ]
        }))}
      />

      <h3>(2) `/mock/popular-snack-brands` 바/도넛 차트</h3>

      <BarChart
        labels={topSnackBrands.map(brand => brand.name)}
        value={topSnackBrands.map(brand => brand.share)}
      />
      <DonutChart
        series={[
          {
            id: '과자 브랜드',
            data: topSnackBrands.map(brand => ({
              name: brand.name,
              value: brand.share
            }))
          }
        ]}
      />

      <h2>(3) `/mock/weekly-mood-trend` 스택형 바 / 면적 차트 </h2>
      <StackedChart
        xAxis={weeklyMoodeTrends.map(trend => trend.week)}
        type="bar"
        series={[
          {
            name: 'happy',
            data: weeklyMoodeTrends.map(trend => trend.happy)
          },
          {
            name: 'tired',
            data: weeklyMoodeTrends.map(trend => trend.tired)
          },
          {
            name: 'stressed',
            data: weeklyMoodeTrends.map(d => d.stressed)
          }
        ]}
      />
      <StackedChart
        xAxis={weeklyMoodeTrends.map(d => d.week)}
        type="area"
        series={[
          {
            name: 'happy',
            data: weeklyMoodeTrends.map(trend => trend.happy)
          },
          {
            name: 'tired',
            data: weeklyMoodeTrends.map(trend => trend.tired)
          },
          {
            name: 'stressed',
            data: weeklyMoodeTrends.map(trend => trend.stressed)
          }
        ]}
      />

      <h2>(4) `/mock/weekly-workout-trend` 스택형 바 / 면적 차트 </h2>
      <StackedChart
        xAxis={weeklyWorkoutTrends.map(trend => trend.week)}
        type="bar"
        series={[
          {
            name: 'running',
            data: weeklyWorkoutTrends.map(trend => trend.running)
          },
          {
            name: 'cycling',
            data: weeklyWorkoutTrends.map(trend => trend.cycling)
          },
          {
            name: 'stretching',
            data: weeklyWorkoutTrends.map(trend => trend.stretching)
          }
        ]}
      />
      <StackedChart
        xAxis={weeklyWorkoutTrends.map(trend => trend.week)}
        type="area"
        series={[
          {
            name: 'running',
            data: weeklyWorkoutTrends.map(trend => trend.running)
          },
          {
            name: 'cycling',
            data: weeklyWorkoutTrends.map(trend => trend.cycling)
          },
          {
            name: 'stretching',
            data: weeklyWorkoutTrends.map(trend => trend.stretching)
          }
        ]}
      />

      <h2>(5)`/mock/coffee-consumption` 멀티라인 차트</h2>
      <MultiLineChart
        xAxis={coffeeConsumptions.teams[0].series.map(item => item.cups)}
        items={coffeeConsumptions.teams.map(team => ({
          name: team.team,
          left: team.series.map(item => item.bugs),
          right: team.series.map(item => item.productivity)
        }))}
        leftAxisLabel="Bugs"
        rightAxisLabel="Productivity"
      />

      <h2>(6)`/mock/snack-impact` 멀티라인 차트</h2>
      <MultiLineChart
        xAxis={snackImpacts.departments[0].metrics.map(item => item.snacks)}
        items={snackImpacts.departments.map(department => ({
          name: department.name,
          left: department.metrics.map(metric => metric.meetingsMissed),
          right: department.metrics.map(metric => metric.morale)
        }))}
        leftAxisLabel="Meetings Missed"
        rightAxisLabel="Morale"
      />
    </div>
  )
}
