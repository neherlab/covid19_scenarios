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
  cumulativeCases: '#aaaaaa',
  newCases: '#fdbf6f',
  hospitalBeds: '#bbbbbb',
  ICUbeds: '#cccccc'
}

export interface LinePlotProps {
  data?: AlgorithmResult
  userResult?: UserResult
  logScale?: boolean
  caseCounts?: EmpiricalData
}

interface LineProps {
  key: string,
  name: string,
  color: string
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
  // FIXME: is `data.stochasticTrajectories.length > 0` correct here?
  if (!data || data.stochasticTrajectories.length > 0) {
    return null
  }
  const hasUserResult = Boolean(userResult?.trajectory)
  const nHospitalBeds = data.params.hospitalBeds
  const nICUBeds = data.params.ICUBeds

  let observations = []
  if (caseCounts) {
    caseCounts.forEach(function(d, i) {
      observations.push({
        time: (new Date(d.time)).getTime(),
        cases: d.cases || undefined,
        observedDeaths: d.deaths || undefined,
        newCases: (i>2)?((d.cases - caseCounts[i-3].cases) || undefined):undefined,
        hospitalBeds: nHospitalBeds,
        ICUbeds: nICUBeds,
      })
    })
  }

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
  const scatterToPlot: LineProps[] = []
  const linesToPlot: LineProps[] = [
      {key:'susceptible', color: colors.susceptible, name:'Susceptible'},
      //{key:'exposed', color: colors.exposed, name:''},
      {key:'infectious', color: colors.infectious, name:'Infectious'},
      {key:'hospitalized', color: colors.severe, name:'Severely ill'},
      {key:'critical', color: colors.critical, name:'Critically ill'},
      {key:'recovered', color: colors.recovered, name:'Recovered'},
      {key:'dead', color: colors.death, name:'Cumulative deaths'},
      {key:'hospitalBeds', color: colors.hospitalBeds, name:'Total hospital beds'},
      {key:'ICUbeds', color: colors.ICUbeds, name:'Total ICU/ICM beds'},
  ]

  // Append empirical data
  const tMin = plotData[0].time
  const tMax = plotData[plotData.length-1].time
  if (observations.length) {
      plotData = plotData.concat(observations) //.filter((d) => {return d.time >= tMin && d.time <= tMax}))
      scatterToPlot.push({key:'observedDeaths', 'color': colors.death, name: "Cumulative confirmed deaths"})
      scatterToPlot.push({key:'cases', 'color': colors.cumulativeCases, name: "Cumulative confirmed cases"})
      scatterToPlot.push({key:'newCases', 'color': colors.newCases, name: "Confirmed cases past 3 days"})
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
                {
                  linesToPlot.map(d => {
                    return (
                      <Line
                        dot={false}
                        type='monotone'
                        strokeWidth={3}
                        dataKey={d.key}
                        stroke={d.color}
                        name={d.name}
                      />
                    )
                    })
                }
                {
                  scatterToPlot.map(d => {
                    return (
                      <Scatter
                        dataKey={d.key}
                        fill={d.color}
                        name={d.name}
                      />
                    )
                    })
                }
              </ComposedChart>
            </>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}
