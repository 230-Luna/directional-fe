/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import { ColorPicker } from './ColorPicker'
import { palette } from '../constants/palette'

interface DonutItem {
  name: string
  value: number
}

interface DonutSeries {
  id: string
  data: DonutItem[]
}

interface DonutChartProps {
  series: DonutSeries[]
}

export const DonutChart = ({ series }: DonutChartProps) => {
  const chartRef = useRef<ReactECharts>(null)
  const [colors, setColors] = useState<Record<string, string>>({})

  const handleChartReady = () => {
    const chart = chartRef.current?.getEchartsInstance()
    if (!chart) return

    const option = chart.getOption() as echarts.EChartsOption
    const nextColors: Record<string, string> = {}

    const seriesArray = Array.isArray(option.series) ? option.series : []

    if (seriesArray.length > 0) {
      const firstSeriesData = (seriesArray[0].data as any[]) || []
      firstSeriesData.forEach((item, index) => {
        nextColors[item.name] =
          item.itemStyle?.color || palette[index % palette.length]
      })
    }

    setColors(nextColors)
  }

  const handleChartItemColorChange = ({
    name,
    color
  }: {
    name: string
    color: string
  }) => {
    setColors(prev => ({ ...prev, [name]: color }))

    const chart = chartRef.current?.getEchartsInstance()
    if (!chart) return

    const option = chart.getOption() as echarts.EChartsOption
    const seriesArray = Array.isArray(option.series) ? option.series : []

    const nextSeries = seriesArray.map((s: any) => ({
      ...s,
      data: (s.data as any[]).map(item =>
        item.name === name
          ? { ...item, itemStyle: { ...(item.itemStyle || {}), color } }
          : item
      )
    }))

    chart.setOption({ series: nextSeries })
  }

  const donutWidth = 60 / series.length

  return (
    <div>
      <ReactECharts
        ref={chartRef}
        notMerge
        onChartReady={handleChartReady}
        option={{
          tooltip: {
            formatter: (params: any) =>
              `${params.seriesName}<br/>${params.name}: ${params.value}%`
          },
          legend: { bottom: 0 },
          series: series.map((s, index) => ({
            id: s.id,
            name: s.id,
            type: 'pie',
            center: ['50%', '50%'],
            radius: [
              `${index * donutWidth}%`,
              `${(index + 1) * donutWidth - 5}%`
            ],
            label: {
              show: index === series.length - 1
            },
            data: s.data.map(item => ({
              ...item,
              itemStyle: { color: colors[item.name] }
            }))
          }))
        }}
      />

      <ColorPicker.Root>
        {Object.keys(colors).map(name => (
          <ColorPicker.Item
            key={name}
            title={name}
            value={colors[name]}
            onChange={color => handleChartItemColorChange({ name, color })}
          />
        ))}
      </ColorPicker.Root>
    </div>
  )
}
