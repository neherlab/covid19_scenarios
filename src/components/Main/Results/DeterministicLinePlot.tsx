import React from 'react'
import ReactResizeDetector from 'react-resize-detector'
import { CartesianGrid, Legend, Line, ComposedChart, Scatter, Tooltip, TooltipPayload, XAxis, YAxis } from 'recharts'
import type { LineProps as RechartsLineProps, YAxisProps } from 'recharts'

import { useTranslation } from 'react-i18next'
import { AlgorithmResult, UserResult } from '../../../algorithms/types/Result.types'
import { EmpiricalData } from '../../../algorithms/types/Param.types'

const ASPECT_RATIO = 16 / 9

export const colors = {
  susceptible: '#a6cee3',
  infectious: '#fdbf6f',
  severe: '#fb9a99',
  critical: '#e31a1c',
  overflow: '#660033',
  recovered: '#33a02c',
  death: '#cab2d6',
  cumulativeCases: '#aaaaaa',
  newCases: '#fdbf6f',
  hospitalBeds: '#bbbbbb',
  ICUbeds: '#cccccc',
}

export interface LinePlotProps {
  data?: AlgorithmResult
  userResult?: UserResult
  logScale?: boolean
  caseCounts?: EmpiricalData
}

interface LineProps {
  key: string
  name: string
  color: string
  legendType?: RechartsLineProps['legendType']
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
  const { t } = useTranslation()

  // FIXME: is `data.stochasticTrajectories.length > 0` correct here?
  if (!data || data.stochasticTrajectories.length > 0) {
    return null
  }
  const hasUserResult = Boolean(userResult?.trajectory)
  const nHospitalBeds = data.params.hospitalBeds
  const nICUBeds = data.params.ICUBeds

  const observations = []
  const count_observations = { cases: 0, ICU: 0, observedDeaths: 0, newCases: 0, hospitalized: 0 }
  if (caseCounts) {
    caseCounts.sort(function (a, b) {
      return a.time > b.time ? 1 : -1
    })
    caseCounts.forEach(function (d, i) {
      if (d.cases) {
        count_observations.cases += 1
      }
      if (d.deaths) {
        count_observations.observedDeaths += 1
      }
      if (d.hospitalized) {
        count_observations.hospitalized += 1
      }
      if (d.ICU) {
        count_observations.ICU += 1
      }
      if (i > 2 && d.cases && caseCounts[i - 3].cases) {
        count_observations.newCases += 1
      }
      observations.push({
        time: new Date(d.time).getTime(),
        cases: d.cases || undefined,
        observedDeaths: d.deaths || undefined,
        currentHospitalized: d.hospitalized || undefined,
        ICU: d.ICU || undefined,
        newCases: i > 2 ? d.cases - caseCounts[i - 3].cases || undefined : undefined,
        hospitalBeds: nHospitalBeds,
        ICUbeds: nICUBeds,
      })
    })
  }

  let plotData = data.deterministicTrajectory
    .filter((d, i) => i % 4 === 0)
    .map((x) => ({
      time: x.time,
      susceptible: Math.round(x.susceptible.total) || undefined,
      exposed: Math.round(x.exposed.total) || undefined,
      infectious: Math.round(x.infectious.total) || undefined,
      hospitalized: Math.round(x.hospitalized.total) || undefined,
      critical: Math.round(x.critical.total) || undefined,
      overflow: Math.round(x.overflow.total) || undefined,
      recovered: Math.round(x.recovered.total) || undefined,
      dead: Math.round(x.dead.total) || undefined,
      hospitalBeds: nHospitalBeds,
      ICUbeds: nICUBeds,
    }))
  const scatterToPlot: LineProps[] = []
  const linesToPlot: LineProps[] = [
    { key: 'hospitalBeds', color: colors.hospitalBeds, name: t('Total hospital beds'), legendType: 'none' },
    { key: 'ICUbeds', color: colors.ICUbeds, name: t('Total ICU/ICM beds'), legendType: 'none' },
    { key: 'susceptible', color: colors.susceptible, name: t('Susceptible'), legendType: 'line' },
    // {key:'exposed', color: colors.exposed, name:'', legendType:"line"},
    { key: 'infectious', color: colors.infectious, name: t('Infectious'), legendType: 'line' },
    // {key:'hospitalized', color: colors.severe, name:'Severely ill', legendType:"line"},
    { key: 'critical', color: colors.critical, name: t('Patients in ICU'), legendType: 'line' },
    { key: 'overflow', color: colors.overflow, name: t('ICU overflow'), legendType: 'line' },
    { key: 'recovered', color: colors.recovered, name: t('Recovered'), legendType: 'line' },
    { key: 'dead', color: colors.death, name: t('Cumulative deaths'), legendType: 'line' },
  ]

  let tMin = plotData[0].time
  let tMax = plotData[plotData.length - 1].time
  // Append empirical data
  if (observations.length) {
    tMin = Math.min(tMin, observations[0].time)
    tMax = Math.max(tMax, observations[observations.length - 1].time)
    plotData = plotData.concat(observations) // .filter((d) => {return d.time >= tMin && d.time <= tMax}))
    if (count_observations.observedDeaths) {
      scatterToPlot.push({ key: 'observedDeaths', color: colors.death, name: t('Cumulative confirmed deaths') })
    }
    if (count_observations.cases) {
      scatterToPlot.push({ key: 'cases', color: colors.cumulativeCases, name: t('Cumulative confirmed cases') })
    }
    if (count_observations.hospitalized) {
      scatterToPlot.push({ key: 'currentHospitalized', color: colors.severe, name: t('Patients in hospital') })
    }
    if (count_observations.ICU) {
      scatterToPlot.push({ key: 'ICU', color: colors.critical, name: t('Patients in ICU') })
    }
    if (count_observations.newCases) {
      scatterToPlot.push({ key: 'newCases', color: colors.newCases, name: t('Confirmed cases past 3 days') })
    }
  }
  const logScaleString: YAxisProps['scale'] = logScale ? t('log') : t('linear')

  return (
    <div className="w-100 h-100" data-testid="DeterministicLinePlot">
      <ReactResizeDetector handleWidth handleHeight>
        {({ width }: { width?: number }) => {
          if (!width) {
            return <div className="w-100 h-100" />
          }

          const height = Math.max(500, width / ASPECT_RATIO)

          return (
            <>
              <h5>{t('Cases through time')}</h5>
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
                <XAxis
                  dataKey="time"
                  type="number"
                  tickFormatter={xTickFormatter}
                  domain={[tMin, tMax]}
                  tickCount={7}
                />
                <YAxis
                  scale={logScaleString}
                  type="number"
                  domain={[1, 'dataMax']}
                  tickFormatter={(tick) => t('localized:number', { value: tick })}
                />
                <Tooltip formatter={tooltipFormatter} labelFormatter={labelFormatter} />
                <Legend verticalAlign="top" />
                {linesToPlot.map((d) => {
                  return (
                    <Line
                      key={d.key}
                      dot={false}
                      isAnimationActive={false}
                      type="monotone"
                      strokeWidth={3}
                      dataKey={d.key}
                      stroke={d.color}
                      name={d.name}
                      legendType={d.legendType}
                    />
                  )
                })}
                {scatterToPlot.map((d) => {
                  return <Scatter key={d.key} dataKey={d.key} fill={d.color} name={d.name} />
                })}
              </ComposedChart>
            </>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}
