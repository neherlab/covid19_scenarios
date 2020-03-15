import React from 'react'
import ReactResizeDetector from 'react-resize-detector'
import { CartesianGrid, Legend, Line, ComposedChart, Scatter, Tooltip, TooltipPayload, XAxis, YAxis } from 'recharts'

import { AlgorithmResult, UserResult } from '../../../algorithms/Result.types'
import { EmpiricalData } from '../../../algorithms/Param.types'

const ASPECT_RATIO = 16 / 9

export const colors = {
  susceptible: '#a6cee3',
  infectious: '#fdbf6f',
  severe: '#fb9a99',
  critical: '#e31a1c',
  recovered: '#33a02c',
  death: '#cab2d6',
}

export interface LinePlotProps {
  data?: AlgorithmResult
  userResult?: UserResult
  logScale?: boolean
  caseCounts?: EmpiricalData
}

function xTickFormatter(tick: string | number): string {
  return new Date(tick).toISOString().slice(0, 10)
}

function tooltipFormatter(
  value: string | number | Array<string | number>,
  name: string,
  entry: TooltipPayload,
  index: number,
): React.ReactNode {
  if (name !== 'time') {
    return value
  }

  // FIXME: is this correct?
  return undefined
}

function labelFormatter(value: string | number): React.ReactNode {
  return xTickFormatter(value)
}

export function DeterministicLinePlot({ data, userResult, logScale, caseCounts }: LinePlotProps) {
  console.log('cases', caseCounts);
  // FIXME: is `data.stochasticTrajectories.length > 0` correct here?
  if (!data || data.stochasticTrajectories.length > 0) {
    return null
  }

  let observations = []
  if (caseCounts) {
    caseCounts.forEach(function(d, i) {
      observations.push({
        time: (new Date(d.time)).getTime(),
        cases: d.cases || undefined,
        observedDeaths: d.deaths || undefined
      })
    })
  }

  const hasUserResult = Boolean(userResult?.trajectory)

  const nHospitalBeds = data.params.hospitalBeds
  const nICUBeds = data.params.ICUBeds
  let plotData = data.deterministicTrajectory
    .filter((d, i) => i % 4 === 0)
    .map(x => ({
      time: x.time,
      susceptible: Math.round(x.susceptible.total) || undefined,
      exposed: Math.round(x.exposed.total) || undefined,
      infectious: Math.round(x.infectious.total) || undefined,
      hospitalized: Math.round(x.hospitalized.total) || undefined,
      critical: Math.round(x.critical.total) || undefined,
      recovered: Math.round(x.recovered.total) || undefined,
      dead: Math.round(x.dead.total) || undefined,
      hospitalBeds: nHospitalBeds,
      ICUbeds: nICUBeds,
    }))

  // Append empirical data
  const tMin = plotData[0].time
  const tMax = plotData[plotData.length-1].time
  if (caseCounts) {
      plotData = plotData.concat(observations) //.filter((d) => {return d.time >= tMin && d.time <= tMax}))
  }

  const logScaleString = logScale ? 'log' : 'linear'
  return (
    <div className="w-100 h-100">
      <ReactResizeDetector handleWidth handleHeight>
        {({ width }: { width?: number }) => {
          if (!width) {
            return <div className="w-100 h-100" />
          }

          const height = width / ASPECT_RATIO

          return (
            <>
              <h5>Cases through time</h5>
              <ComposedChart
                width={width}
                height={height}
                data={plotData}
                margin={{
                  left: 15,
                  right: 15,
                  bottom: 15,
                  top: 15,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" type="number" tickFormatter={xTickFormatter} domain={[tMin, tMax]} />
                <YAxis scale={logScaleString} type="number" domain={[1, 'dataMax']} />
                <Tooltip formatter={tooltipFormatter} labelFormatter={labelFormatter} />
                <Legend verticalAlign="top" />
                <Line
                  dot={false}
                  type="monotone"
                  strokeWidth={3}
                  dataKey="susceptible"
                  stroke={colors.susceptible}
                  name="Susceptible"
                />
                <Line
                  dot={false}
                  type="monotone"
                  strokeWidth={3}
                  dataKey="infectious"
                  stroke={colors.infectious}
                  name="Infectious"
                />
                <Line
                  dot={false}
                  type="monotone"
                  strokeWidth={3}
                  dataKey="hospitalized"
                  stroke={colors.severe}
                  name="Severely ill"
                />
                <Line
                  dot={false}
                  type="monotone"
                  strokeWidth={3}
                  dataKey="critical"
                  stroke={colors.critical}
                  name="Critically ill"
                />
                <Line
                  dot={false}
                  type="monotone"
                  strokeWidth={3}
                  dataKey="dead"
                  stroke={colors.death}
                  name="Cumulative deaths"
                />
                <Line
                  dot={false}
                  type="monotone"
                  strokeWidth={3}
                  dataKey="recovered"
                  stroke={colors.recovered}
                  name="Recovered"
                />
                <Line
                  dot={false}
                  type="monotone"
                  strokeWidth={3}
                  dataKey="hospitalBeds"
                  stroke="#aaaaaa"
                  name="total hospital beds"
                />
                <Line
                  dot={false}
                  type="monotone"
                  strokeWidth={3}
                  dataKey="ICUbeds"
                  stroke="#cccccc"
                  name="total ICU/ICM beds"
                />
                <Scatter
                  dataKey="cases"
                  fill={colors.infectious}
                  legendType="none"
                />
                <Scatter
                  dataKey="observedDeaths"
                  fill={colors.death}
                  legendType="none"
                />
              </ComposedChart>
            </>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}
