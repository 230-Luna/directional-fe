/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import { ColorPicker } from './ColorPicker'
import { palette } from '../constants/palette'

interface Series {
  name: string
  data: number[]
}

interface StackedChartProps {
  type: 'bar' | 'area'
  xAxis: string[]
  series: Series[]
}

export const StackedChart = ({ xAxis, series, type }: StackedChartProps) => {
  const chartRef = useRef<ReactECharts>(null)

  const [colors, setColors] = useState<Record<string, string>>(
    series.reduce(
      (acc, item, i) => {
        acc[item.name] = palette[i % palette.length]
        return acc
      },
      {} as Record<string, string>
    )
  )

  const handleColorChange = (name: string, color: string) => {
    setColors(prev => ({ ...prev, [name]: color }))

    const chart = chartRef.current?.getEchartsInstance()

    if (chart == null) {
      return
    }

    const option = chart.getOption() as echarts.EChartsOption
    const seriesArray = Array.isArray(option.series) ? option.series : []

    const nextSeries = seriesArray.map((item: any) =>
      item.name === name
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
          tooltip: { trigger: 'axis' },
          legend: {},
          xAxis: { type: 'category', data: xAxis },
          yAxis: { type: 'value', max: 100 },
          series: series.map(item => ({
            name: item.name,
            data: item.data,
            type: type === 'bar' ? 'bar' : 'line',
            stack: 'total',
            areaStyle: type === 'area' ? {} : undefined,
            itemStyle: { color: colors[item.name] }
          }))
        }}
      />

      <ColorPicker.Root>
        {series.map(item => (
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
