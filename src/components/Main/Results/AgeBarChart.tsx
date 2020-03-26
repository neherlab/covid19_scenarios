import React from 'react'

import ReactResizeDetector from 'react-resize-detector'

import { useTranslation } from 'react-i18next'

import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, TooltipPayload } from 'recharts'

import { AlgorithmResult } from '../../../algorithms/types/Result.types'

import { SeverityTableRow } from '../Scenario/SeverityTable'

import { numberFormatter } from '../../../helpers/numberFormat'

import { colors } from './DeterministicLinePlot'

const ASPECT_RATIO = 16 / 4

export interface SimProps {
  showHumanized?: boolean
  data?: AlgorithmResult
  rates?: SeverityTableRow[]
}

export function AgeBarChart({ showHumanized, data, rates }: SimProps) {
  const { t: unsafeT } = useTranslation()

  if (!data || !rates) {
    return null
  }

  const formatNumber = numberFormatter(!!showHumanized, !showHumanized)

  const t = (...args: Parameters<typeof unsafeT>) => {
    const translation = unsafeT(...args)
    if (typeof translation === 'string' || typeof translation === 'undefined') {
      return translation
    }

    process.env.NODE_ENV !== 'production' && console.warn('Translation incomatible in AgeBarChart.tsx', ...args)
    return String(translation)
  }

  const ages = Object.keys(data.params.ageDistribution)
  const lastDataPoint = data.deterministicTrajectory[data.deterministicTrajectory.length - 1]
  const plotData = ages.map((age) => ({
    name: age,
    fraction: Math.round(data.params.ageDistribution[age] * 1000) / 10,
    peakSevere: Math.round(Math.max(...data.deterministicTrajectory.map((x) => x.hospitalized[age]))),
    peakCritical: Math.round(Math.max(...data.deterministicTrajectory.map((x) => x.critical[age]))),
    peakOverflow: Math.round(Math.max(...data.deterministicTrajectory.map((x) => x.overflow[age]))),
    totalDead: Math.round(lastDataPoint.dead[age]),
  }))

  const tooltipFormatter = (
    value: string | number | Array<string | number>,
    name: string,
    entry: TooltipPayload,
    index: number,
  ) => <span>{formatNumber(Number(value))}</span>

  const tickFormatter = (value: number) => formatNumber(value)

  return (
    <div className="w-100 h-100" data-testid="AgeBarChart">
      <ReactResizeDetector handleWidth handleHeight>
        {({ width }: { width?: number }) => {
          if (!width) {
            return <div className="w-100 h-100" />
          }
          const height = Math.max(250, width / ASPECT_RATIO)

          return (
            <>
              <h5>{t('Distribution across age groups')}</h5>
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
                <YAxis
                  label={{ value: t('Cases'), angle: -90, position: 'insideLeft' }}
                  tickFormatter={tickFormatter}
                />
                <Tooltip formatter={tooltipFormatter} />
                <Legend verticalAlign="top" />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="peakSevere" fill={colors.severe} name={t('peak severe')} />
                <Bar dataKey="peakCritical" fill={colors.critical} name={t('peak critical')} />
                <Bar dataKey="peakOverflow" fill={colors.overflow} name={t('peak overflow')} />
                <Bar dataKey="totalDead" fill={colors.death} name={t('total deaths')} />
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
                <XAxis dataKey="name" label={{ value: t('Age'), position: 'insideBottom', offset: -3 }} />
                <YAxis
                  label={{
                    value: t('% of total'),
                    angle: -90,
                    position: 'insideLeft',
                  }}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Bar dataKey="fraction" fill="#aaaaaa" name={t('% of total')} />
              </BarChart>
            </>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}
