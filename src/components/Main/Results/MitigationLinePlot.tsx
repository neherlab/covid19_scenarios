import React from 'react'

import _ from 'lodash'

import { CartesianGrid, ComposedChart, Label, ReferenceArea, XAxis, YAxis } from 'recharts'

import type { MitigationInterval, NumericRangeNonNegative } from '../../../algorithms/types/Param.types'

const intervalOpacity = (transmissionReduction: NumericRangeNonNegative): number => {
  const { begin, end } = transmissionReduction
  return 0.1 + 0.006 * (100 - (end - begin))
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
      {mitigation.map(({ id, name, timeRange, transmissionReduction, color }, i) => {
        return (
          <ReferenceArea
            key={id}
            x1={_.clamp(timeRange.begin.getTime(), tMin, tMax)}
            x2={_.clamp(timeRange.end.getTime(), tMin, tMax)}
            y1={_.clamp(transmissionReduction.begin - 2, 0, 100)}
            y2={_.clamp(transmissionReduction.end + 2, 0, 100)}
            yAxisId={'mitigationStrengthAxis'}
            fill={color}
            stroke={color}
            fillOpacity={intervalOpacity(transmissionReduction)}
          >
            <Label value={name} position={i % 2 ? 'insideRight' : 'insideLeft'} fill="#444444" />
          </ReferenceArea>
        )
      })}
    </ComposedChart>
  )
}
