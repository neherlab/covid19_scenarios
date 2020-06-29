import React from 'react'

import { useTranslation } from 'react-i18next'

import * as d3 from 'd3'
import { Col, Row } from 'reactstrap'
import { connect } from 'react-redux'

import { Chart } from 'react-google-charts'

import type { AlgorithmResult } from '../../../algorithms/types/Result.types'

import type { State } from '../../../state/reducer'
import { selectResult } from '../../../state/algorithm/algorithm.selectors'
import { selectShouldFormatNumbers } from '../../../state/settings/settings.selectors'

import { numberFormatter } from '../../../helpers/numberFormat'

interface RowProps {
  entry: number[]
  fmt: (x: number) => string
}

function TableRow({ entry, fmt }: RowProps) {
  switch (entry.length) {
    case 1:
      return <td>{fmt(entry[0])}</td>
    case 3:
      return (
        <td>
          ({fmt(entry[0])}, <b>{fmt(entry[1])}</b>, {fmt(entry[2])})
        </td>
      )
    default:
      return <td />
  }
}

const percentageFormatter = (v: number) => `${d3.format('.2f')(v * 100)}%`

export interface TableProps {
  result?: AlgorithmResult
  shouldFormatNumbers: boolean
  forPrint?: boolean
}

const mapStateToProps = (state: State) => ({
  result: selectResult(state),
  shouldFormatNumbers: selectShouldFormatNumbers(state),
})

const mapDispatchToProps = {}

export const OutcomeRatesTable = connect(mapStateToProps, mapDispatchToProps)(OutcomeRatesTableDisconnected)

export function OutcomeRatesTableDisconnected({ result, shouldFormatNumbers, forPrint }: TableProps) {
  const { t } = useTranslation()

  if (!result) {
    return null
  }

  const formatNumber = numberFormatter(shouldFormatNumbers, false)

  const endResult = {
    lower: result.trajectory.lower[result.trajectory.middle.length - 1],
    value: result.trajectory.middle[result.trajectory.middle.length - 1],
    upper: result.trajectory.upper[result.trajectory.middle.length - 1],
  }

  const totalDeath = [
    endResult.lower.cumulative.fatality.total,
    endResult.value.cumulative.fatality.total,
    endResult.upper.cumulative.fatality.total,
  ]
  const totalSevere = [
    endResult.lower.cumulative.hospitalized.total,
    endResult.value.cumulative.hospitalized.total,
    endResult.upper.cumulative.hospitalized.total,
  ]
  const totalCritical = [
    endResult.lower.cumulative.critical.total,
    endResult.value.cumulative.critical.total,
    endResult.upper.cumulative.critical.total,
  ]
  const totalCases = [
    endResult.lower.cumulative.recovered.total + endResult.lower.cumulative.fatality.total,
    endResult.value.cumulative.recovered.total + endResult.value.cumulative.fatality.total,
    endResult.upper.cumulative.recovered.total + endResult.upper.cumulative.fatality.total,
  ]

  const severeFrac = totalSevere.map((x, i) => (1.0 * x) / totalCases[i])
  const criticalFrac = totalCritical.map((x, i) => (1.0 * x) / totalCases[i])
  const deathFrac = totalDeath.map((x, i) => (1.0 * x) / totalCases[i])
  const mildFrac = severeFrac.map((x, i) => 1 - x - criticalFrac[i] - deathFrac[i])

  const peakSevere = [
    Math.round(Math.max(...result.trajectory.lower.map((x) => x.current.severe.total))),
    Math.round(Math.max(...result.trajectory.middle.map((x) => x.current.severe.total))),
    Math.round(Math.max(...result.trajectory.upper.map((x) => x.current.severe.total))),
  ]
  const peakCritical = [
    Math.round(Math.max(...result.trajectory.lower.map((x) => x.current.critical.total + x.current.overflow.total))),
    Math.round(Math.max(...result.trajectory.middle.map((x) => x.current.critical.total + x.current.overflow.total))),
    Math.round(Math.max(...result.trajectory.upper.map((x) => x.current.critical.total + x.current.overflow.total))),
  ]

  const totalFormatter = (value: number) => formatNumber(value)

  const proportionsData = [
    ['Cathergory', 'Percentage'],
    [`Mild ${percentageFormatter(mildFrac.slice(1, 2)[0])}`, mildFrac.slice(1, 2)[0]],
    [`Severe ${percentageFormatter(severeFrac.slice(1, 2)[0])}`, severeFrac.slice(1, 2)[0]],
    [`Critical ${percentageFormatter(criticalFrac.slice(1, 2)[0])}`, criticalFrac.slice(1, 2)[0]],
    [`Fatal ${percentageFormatter(deathFrac.slice(1, 2)[0])}`, deathFrac.slice(1, 2)[0]],
  ]

  const proportionsLabelColors = [
    { color: '#fdbf6f' },
    { color: '#fb9a99' },
    { color: '#e31a1c' },
    { color: '#cab2d6' },
  ]

  const PieData = () => {
    return (
      <Chart
        width={'100%'}
        height={'200px'}
        chartType="PieChart"
        loader={<div>Loading Chart...</div>}
        data={proportionsData}
        options={{
          slices: proportionsLabelColors,
          backgroundColor: forPrint ? 'white' : '#f8f9fa',
        }}
      />
    )
  }

  if (forPrint) {
    return (
      <div>
        <h3>{t('Proportions')}</h3>
        <PieData />
        <h3>{t('Totals/Peak')}</h3>
        <table>
          <thead>
            <tr>
              <th>{t('Quantity')}</th>
              <th>{t('Peak/total value')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('Total death')}: </td>
              <TableRow entry={totalDeath} fmt={totalFormatter} />
            </tr>
            <tr>
              <td>{t('Total severe')}: </td>
              <TableRow entry={totalSevere} fmt={totalFormatter} />
            </tr>
            <tr>
              <td>{t('Peak severe')}: </td>
              <TableRow entry={peakSevere} fmt={totalFormatter} />
            </tr>
            <tr>
              <td>{t('Peak critical')}: </td>
              <TableRow entry={peakCritical} fmt={totalFormatter} />
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  // TODO: replace this with the table component (similar to severity table)
  return (
    <Row data-testid="OutcomeRatesTable">
      <Col lg={6}>
        <h3>{t('Proportions')}</h3>
        <PieData />
      </Col>
      <Col lg={6}>
        <h3>{t('Totals/Peak')}</h3>
        <table>
          <thead>
            <tr>
              <th>{t('Quantity')}</th>
              <th>{t('Peak/total value')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('Total death')}: </td>
              <TableRow entry={totalDeath} fmt={totalFormatter} />
            </tr>
            <tr>
              <td>{t('Total severe')}: </td>
              <TableRow entry={totalSevere} fmt={totalFormatter} />
            </tr>
            <tr>
              <td>{t('Peak severe')}: </td>
              <TableRow entry={peakSevere} fmt={totalFormatter} />
            </tr>
            <tr>
              <td>{t('Peak critical')}: </td>
              <TableRow entry={peakCritical} fmt={totalFormatter} />
            </tr>
          </tbody>
        </table>
      </Col>
    </Row>
  )
}
