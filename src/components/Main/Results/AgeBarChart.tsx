import React from 'react'

import ReactResizeDetector from 'react-resize-detector'

import { useTranslation } from 'react-i18next'

import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, LabelProps } from 'recharts'

import { AlgorithmResult } from '../../../algorithms/types/Result.types'

import { SeverityTableRow } from '../Scenario/ScenarioTypes'

import { numberFormatter } from '../../../helpers/numberFormat'

import { colors } from './DeterministicLinePlot'

import { calculatePosition, scrollToRef } from './chartHelper'
import { ResponsiveTooltipContent } from './ResponsiveTooltipContent'

const ASPECT_RATIO = 16 / 4

export interface SimProps {
  showHumanized?: boolean
  data?: AlgorithmResult
  rates?: SeverityTableRow[]
  forcedWidth?: number
  forcedHeight?: number
  printLabel?: boolean
}

export function AgeBarChart({ printLabel, showHumanized, data, rates, forcedWidth, forcedHeight }: SimProps) {
  const { t: unsafeT } = useTranslation()
  const casesChartRef = React.useRef(null)
  const percentageChartRef = React.useRef(null)

  const label: LabelProps | undefined = printLabel
    ? {
        position: 'top',
        fill: '#444444',
        fontSize: '11px',
        formatter: (label: string | number) => (label > 0 ? label : null),
      }
    : undefined

  if (!data || !rates) {
    return null
  }

  const formatNumberRounded = numberFormatter(!!showHumanized, true)

  const t = (...args: Parameters<typeof unsafeT>) => {
    const translation = unsafeT(...args)
    if (typeof translation === 'string' || typeof translation === 'undefined') {
      return translation
    }

    if (process.env.NODE_ENV !== 'production') {
      console.warn('Translation incomatible in AgeBarChart.tsx', ...args)
    }
    return String(translation)
  }

  const ages = Object.keys(data.params.ageDistribution)
  const lastDataPoint = data.deterministic.trajectory[data.deterministic.trajectory.length - 1]
  const plotData = ages.map((age) => ({
    name: age,
    fraction: Math.round(data.params.ageDistribution[age] * 1000) / 10,
    peakSevere: Math.round(Math.max(...data.deterministic.trajectory.map((x) => x.current.severe[age]))),
    peakCritical: Math.round(Math.max(...data.deterministic.trajectory.map((x) => x.current.critical[age]))),
    peakOverflow: Math.round(Math.max(...data.deterministic.trajectory.map((x) => x.current.overflow[age]))),
    totalFatalities: Math.round(lastDataPoint.cumulative.fatality[age]),
  }))

  const tickFormatter = (value: number) => formatNumberRounded(value)

  return (
    <div className="w-100 h-100" data-testid="AgeBarChart">
      <ReactResizeDetector handleWidth handleHeight>
        {({ width }: { width?: number }) => {
          if (!width) {
            return <div className="w-100 h-100" />
          }

          const height = Math.max(300, width / ASPECT_RATIO)
          const tooltipPosition = calculatePosition(height)

          return (
            <>
              <h3>{t('Distribution across age groups')}</h3>

              <div ref={casesChartRef} />
              <BarChart
                onClick={() => scrollToRef(casesChartRef)}
                width={forcedWidth || width}
                height={forcedHeight || height}
                data={plotData}
                margin={{
                  left: 0,
                  right: 0,
                  bottom: 10,
                  top: 10,
                }}
              >
                <XAxis
                  dataKey="name"
                  label={{ value: t('Age'), textAnchor: 'middle', position: 'insideBottom', offset: -3 }}
                />
                <YAxis
                  label={{ value: t('Cases'), angle: -90, position: 'insideLeft' }}
                  tickFormatter={tickFormatter}
                />
                <YAxis
                  label={{ value: t('Age distribution [%]'), textAnchor: 'middle', angle: 90, position: 'insideRight' }}
                  orientation={'right'}
                  yAxisId="ageDisAxis"
                  tickFormatter={tickFormatter}
                />
                <Tooltip position={tooltipPosition} content={ResponsiveTooltipContent} />
                <Legend verticalAlign="bottom" />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="peakSevere" fill={colors.severe} name={t('peak severe')} label={label} />
                <Bar dataKey="peakCritical" fill={colors.critical} name={t('peak critical')} label={label} />
                <Bar dataKey="peakOverflow" fill={colors.overflow} name={t('peak overflow')} label={label} />
                <Bar dataKey="totalFatalities" fill={colors.fatality} name={t('total deaths')} label={label} />
                <Bar dataKey="fraction" fill="#aaaaaa" name={t('% of population')} yAxisId={'ageDisAxis'} />
              </BarChart>

              <div ref={percentageChartRef} />
            </>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}
