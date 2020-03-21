import React from 'react'

import ReactResizeDetector from 'react-resize-detector'

import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from 'recharts'

import { AlgorithmResult } from '../../../algorithms/Result.types'

import { SeverityTableRow } from '../Scenario/SeverityTable'

import { colors } from './DeterministicLinePlot'

const ASPECT_RATIO = 16 / 4

export interface SimProps {
  data?: AlgorithmResult
  rates?: SeverityTableRow[]
}

export function AgeBarChart({ data, rates }: SimProps) {
  if (!data || !rates) {
    return null
  }

  const ages = Object.keys(data.params.ageDistribution)
  const lastDataPoint = data.deterministicTrajectory[data.deterministicTrajectory.length - 1]
  const plotData = ages.map(age => ({
    name: age,
    fraction: Math.round(data.params.ageDistribution[age] * 1000) / 10,
    peakSevere: Math.round(Math.max(...data.deterministicTrajectory.map(x => x.hospitalized[age]))),
    peakCritical: Math.round(Math.max(...data.deterministicTrajectory.map(x => x.critical[age]))),
    peakOverflow: Math.round(Math.max(...data.deterministicTrajectory.map(x => x.overflow[age]))),
    totalDead: Math.round(lastDataPoint.dead[age]),
  }))

  return (
    <div className="w-100 h-100">
      <ReactResizeDetector handleWidth handleHeight>
        {({ width }: { width?: number }) => {
          if (!width) {
            return <div className="w-100 h-100" />
          }

          const height = Math.max(250, width / ASPECT_RATIO)

          return (
            <>
              <h5>Distribution across age groups</h5>
              <BarChart
                width={width}
                height={height}
                data={plotData}
                margin={{
                  left: 15,
                  right: 15,
                  bottom: 3,
                  top: 15,
                }}
              >
                <XAxis dataKey="name" />
                <YAxis label={{ value: 'Cases', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend verticalAlign="top"/>
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="peakSevere" fill={colors.severe} name="peak severe" />
                <Bar dataKey="peakCritical" fill={colors.critical} name="peak critical" />
                <Bar dataKey="peakOverflow" fill={colors.overflow} name="peak overflow" />
                <Bar dataKey="totalDead" fill={colors.death} name="total deaths" />
              </BarChart>
              <BarChart
                width={width}
                height={height}
                data={plotData}
                margin={{
                  left: 15,
                  right: 15,
                  bottom: 15,
                  top: 3,
                }}
              >
                <XAxis dataKey="name" label={{ value: 'Age', position: 'insideBottom', offset: -3 }} />
                <YAxis
                  label={{
                    value: '% of total',
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Bar dataKey="fraction" fill="#aaaaaa" name="% of total" />
              </BarChart>
            </>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}
