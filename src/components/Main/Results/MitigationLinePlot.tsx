import React from 'react'

import _ from 'lodash'

import { CartesianGrid, ComposedChart, Label, ReferenceArea, XAxis, YAxis } from 'recharts'
import { MitigationInterval } from '../../../.generated/types'

const intervalOpacity = (interval: MitigationInterval): number => {
  return 0.1 + 0.006 * (100 - (interval.mitigationValue[1] - interval.mitigationValue[0]))
}

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
        top: 0,
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
      <YAxis
        yAxisId="mitigationStrengthAxis"
        allowDataOverflow
        orientation={'left'}
        type="number"
        label={{ value: 'Efficiency', angle: -90 }}
        domain={[0, 100]}
      />
      {mitigation.map((interval, i) => (
        <ReferenceArea
          key={interval.id}
          x1={_.clamp(interval.timeRange.tMin.getTime(), tMin, tMax)}
          x2={_.clamp(interval.timeRange.tMax.getTime(), tMin, tMax)}
          y1={_.clamp(interval.mitigationValue[0] - 2, 0, 100)}
          y2={_.clamp(interval.mitigationValue[1] + 2, 0, 100)}
          yAxisId={'mitigationStrengthAxis'}
          fill={interval.color}
          stroke={interval.color}
          fillOpacity={intervalOpacity(interval)}
        >
          <Label value={interval.name} position={i % 2 ? 'insideRight' : 'insideLeft'} fill="#444444" />
        </ReferenceArea>
      ))}
    </ComposedChart>
  )
}
