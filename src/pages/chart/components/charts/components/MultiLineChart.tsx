/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts'
import { ColorPicker } from './ColorPicker'
import { palette } from '../constants/palette'

interface SeriesItem {
  name: string
  left: number[]
  right: number[]
}

interface MultiLineChartProps {
  xAxis: number[]
  items: SeriesItem[]
  leftAxisLabel: string
  rightAxisLabel: string
}

export const MultiLineChart = ({
  xAxis,
  items,
  leftAxisLabel,
  rightAxisLabel
}: MultiLineChartProps) => {
  const chartRef = useRef<ReactECharts>(null)

  const [colors, setColors] = useState<Record<string, string>>(
    items.reduce(
      (acc, item, index) => {
        acc[item.name] = palette[index % palette.length]
        return acc
      },
      {} as Record<string, string>
    )
  )

  const handleColorChange = (item: string, color: string) => {
    setColors(prev => ({ ...prev, [item]: color }))

    const chart = chartRef.current?.getEchartsInstance()
    if (!chart) return

    const option = chart.getOption() as echarts.EChartsOption
    const seriesArray = Array.isArray(option.series) ? option.series : []

    const nextSeries = seriesArray.map((s: any) => {
      if (s.name.startsWith(item)) {
        return {
          ...s,
          itemStyle: {
            ...(s.itemStyle || {}),
            color
          }
        }
      }
      return s
    })

    chart.setOption({ series: nextSeries })
  }

  return (
    <div>
      <ReactECharts
        ref={chartRef}
        notMerge
        option={{
          tooltip: { trigger: 'item' },
          legend: {},
          xAxis: { type: 'category', data: xAxis },
          yAxis: [
            { type: 'value', name: leftAxisLabel },
            { type: 'value', name: rightAxisLabel }
          ],
          series: items.flatMap(item => [
            {
              name: `${item.name} ${leftAxisLabel}`,
              type: 'line',
              yAxisIndex: 0,
              symbol: 'circle',
              itemStyle: { color: colors[item.name] },
              data: item.left
            },
            {
              name: `${item.name} ${rightAxisLabel}`,
              type: 'line',
              yAxisIndex: 1,
              symbol: 'rect',
              lineStyle: { type: 'dashed' },
              itemStyle: { color: colors[item.name] },
              data: item.right
            }
          ])
        }}
      />

      <ColorPicker.Root>
        {items.map(item => (
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
