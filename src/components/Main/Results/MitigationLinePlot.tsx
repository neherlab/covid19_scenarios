import React from 'react'

import _ from 'lodash'

import { CartesianGrid, ComposedChart, Label, ReferenceArea, XAxis, YAxis } from 'recharts'
import { MitigationInterval } from '../../../.generated/types'

export interface MitigationPlotProps {
  mitigation: MitigationInterval[]
  width: number
  height: number
  tMin: number
  tMax: number
}

export function MitigationPlot({ mitigation, width, height, tMin, tMax }: MitigationPlotProps) {
  return (
    <ComposedChart
      width={width}
      height={height}
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
      <YAxis yAxisId="mitigationStrengthAxis" allowDataOverflow orientation={'left'} type="number" domain={[0, 100]} />
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
