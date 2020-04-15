import React from 'react'

import _ from 'lodash'

import { CartesianGrid, ComposedChart, Label, ReferenceArea, XAxis, YAxis, Line, Area } from 'recharts'
import { MitigationInterval } from '../../../.generated/types'
import { TimeSeriesWithRange } from '../../../algorithms/types/Result.types'

export interface MitigationPlotProps {
  mitigation: MitigationInterval[]
  R0Trajectory: TimeSeriesWithRange
  width: number
  height: number
  tMin: number
  tMax: number
}

export function MitigationPlot({ mitigation, R0Trajectory, width, height, tMin, tMax }: MitigationPlotProps) {
  const plotData = R0Trajectory.mean.map((d, i) => {
    return {
      time: d.t,
      one: 1.0,
      mean: d.y,
      range: [R0Trajectory.lower[i].y, R0Trajectory.upper[i].y],
    }
  })
  const R0Color = '#883322'
  return (
    <ComposedChart
      width={width}
      height={height}
      data={plotData}
      margin={{
        left: 5,
        right: 5,
        top: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        allowDataOverflow
        dataKey="time"
        type="number"
        domain={[tMin, tMax]}
        tickFormatter={() => ''}
        tickCount={7}
      />
      <YAxis yAxisId="R0Axis" allowDataOverflow orientation={'left'} type="number" />
      <Line
        key={'mean'}
        dot={false}
        isAnimationActive={false}
        type="monotone"
        strokeWidth={3}
        dataKey={'mean'}
        stroke={R0Color}
        name={'Average R0'}
        yAxisId="R0Axis"
      />
      <Line
        key={'one'}
        dot={false}
        isAnimationActive={false}
        type="monotone"
        strokeWidth={3}
        dataKey={'one'}
        stroke={'#ccc'}
        yAxisId="R0Axis"
      />
      <Area
        key={'range'}
        type="monotone"
        fillOpacity={0.075}
        dataKey={'range'}
        isAnimationActive={false}
        name={'R0 range'}
        stroke={R0Color}
        strokeWidth={0}
        fill={R0Color}
        yAxisId="R0Axis"
      />

      <YAxis yAxisId="mitigationStrengthAxis" allowDataOverflow orientation={'right'} type="number" domain={[0, 100]} />
      {mitigation.map((interval) => (
        <ReferenceArea
          key={interval.id}
          x1={_.clamp(interval.timeRange.tMin.getTime(), tMin, tMax)}
          x2={_.clamp(interval.timeRange.tMax.getTime(), tMin, tMax)}
          y1={0}
          y2={_.clamp(interval.mitigationValue[0], 0, 100)}
          yAxisId={'mitigationStrengthAxis'}
          fill={interval.color}
          fillOpacity={0.1}
        >
          <Label value={interval.name} position="insideTopRight" fill="#444444" />
        </ReferenceArea>
      ))}
    </ComposedChart>
  )
}
