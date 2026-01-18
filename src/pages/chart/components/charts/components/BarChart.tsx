import { useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import { ColorPicker } from './ColorPicker'
import { palette } from '../constants/palette'

interface BarSeries {
  name: string
  data: number[]
}

interface BarChartProps {
  labels: string[]
  series?: BarSeries[]
  value?: number[]
}

export const BarChart = ({ labels, series, value }: BarChartProps) => {
  const chartRef = useRef<ReactECharts>(null)

  const mergedSeries: BarSeries[] = value
    ? labels.map((label, i) => ({ name: label, data: [value[i]] }))
    : series || []

  const [colors, setColors] = useState<Record<string, string>>(
    mergedSeries.reduce(
      (acc, item, i) => {
        acc[item.name] = palette[i % palette.length]
        return acc
      },
      {} as Record<string, string>
    )
  )

  const handleColorChange = (seriesName: string, color: string) => {
    setColors(prev => ({ ...prev, [seriesName]: color }))

    const chart = chartRef.current?.getEchartsInstance()
    if (!chart) return

    const option = chart.getOption() as echarts.EChartsOption
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nextSeries = (option.series as any[]).map(item =>
      item.name === seriesName
        ? { ...item, itemStyle: { ...(item.itemStyle || {}), color } }
        : item
    )

    chart.setOption({ series: nextSeries })
  }

  return (
    <div>
      <ReactECharts
        ref={chartRef}
        notMerge
        option={{
          grid: { left: 24, right: 24, bottom: 48, containLabel: true },
          tooltip: { trigger: 'axis' },
          legend: {},
          xAxis: {
            type: 'category',
            data: value ? [''] : labels,
            axisTick: { alignWithLabel: true },
            axisLabel: { interval: 0 }
          },
          yAxis: { type: 'value' },
          series: mergedSeries.map(item => ({
            name: item.name,
            type: 'bar',
            data: item.data,
            barMaxWidth: 40,
            itemStyle: { color: colors[item.name] }
          }))
        }}
      />

      <ColorPicker.Root>
        {mergedSeries.map(item => (
          <ColorPicker.Item
            key={item.name}
            title={item.name}
            value={colors[item.name]}
            onChange={color => handleColorChange(item.name, color)}
          />
        ))}
      </ColorPicker.Root>
    </div>
  )
}
