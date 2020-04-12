import React from 'react'

import { useTranslation } from 'react-i18next'

import { Col, Row } from 'reactstrap'

import * as d3 from 'd3'

import { AlgorithmResult } from '../../../algorithms/types/Result.types'

import { SeverityTableRow } from '../Scenario/ScenarioTypes'

import { numberFormatter } from '../../../helpers/numberFormat'

export interface TableProps {
  showHumanized?: boolean
  result?: AlgorithmResult
  rates?: SeverityTableRow[]
  printable?: boolean
}

const percentageFormatter = (v: number) => d3.format('.2f')(v * 100)

export function OutcomeRatesTable({ showHumanized, result, rates, printable }: TableProps) {
  const { t } = useTranslation()

  if (!result || !rates) {
    return null
  }

  const formatNumber = numberFormatter(!!showHumanized, false)

  /*
  // FIXME: This looks like a prefix sum. Should we use `Array.reduce()` or a library instead?
  let deathFrac    = 0
  let severeFrac   = 0
  let criticalFrac = 0

  const { params } = result

  rates.forEach(d => {
    const freq    = params.ageDistribution[d.ageGroup]
    severeFrac   += freq * params.infectionSeverityRatio[d.ageGroup]
    criticalFrac += freq * params.infectionSeverityRatio[d.ageGroup] * (d.critical / 100)
    deathFrac    += freq * params.infectionSeverityRatio[d.ageGroup] * (d.critical / 100) * (d.fatal / 100)
  })

  let mildFrac = 1 - severeFrac - criticalFrac - deathFrac
  */

  const endResult = result.deterministic.trajectory[result.deterministic.trajectory.length - 1]

  const totalDeath = endResult.cumulative.fatality.total
  const totalSevere = endResult.cumulative.hospitalized.total
  const totalCritical = endResult.cumulative.critical.total
  const totalCases = endResult.cumulative.recovered.total + endResult.cumulative.fatality.total

  const severeFrac = (1.0 * totalSevere) / totalCases
  const criticalFrac = (1.0 * totalCritical) / totalCases
  const deathFrac = (1.0 * totalDeath) / totalCases
  const mildFrac = 1 - severeFrac - criticalFrac - deathFrac

  const peakSevere = Math.round(Math.max(...result.deterministic.trajectory.map((x) => x.current.severe.total)))
  const peakCritical = Math.round(Math.max(...result.deterministic.trajectory.map((x) => x.current.critical.total + x.current.overflow.total))) // prettier-ignore

  const totalFormatter = (value: number) => formatNumber(value)

  if (printable) {
    return (
      <div>
        <h3>{t('Proportions')}</h3>
        <table>
          <thead>
            <tr>
              <th>{t('Outcome')} &emsp; </th>
              <th>{t('Population average')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('Mild')} [%]: </td>
              <td>{percentageFormatter(mildFrac)}</td>
            </tr>
            <tr>
              <td>{t('Severe')} [%]: </td>
              <td>{percentageFormatter(severeFrac)}</td>
            </tr>
            <tr>
              <td>{t('Critical')} [%]: </td>
              <td>{percentageFormatter(criticalFrac)}</td>
            </tr>
            <tr>
              <td>{t('Fatal')} [%]: </td>
              <td>{percentageFormatter(deathFrac)}</td>
            </tr>
          </tbody>
        </table>
        <h3>{t('Totals/Peak')}</h3>
        <table>
          <thead>
            <tr>
              <th>{t('Quantity')} &emsp; </th>
              <th>{t('Peak/total value')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('Total death')}: </td>
              <td>{totalFormatter(totalDeath)}</td>
            </tr>
            <tr>
              <td>{t('Total severe')}: </td>
              <td>{totalFormatter(totalSevere)}</td>
            </tr>
            <tr>
              <td>{t('Peak severe')}: </td>
              <td>{totalFormatter(peakSevere)}</td>
            </tr>
            <tr>
              <td>{t('Peak critical')}: </td>
              <td>{totalFormatter(peakCritical)}</td>
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
        <table>
          <thead>
            <tr>
              <th>{t('Outcome')} &emsp; </th>
              <th>{t('Population average')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('Mild')} [%]: </td>
              <td>{percentageFormatter(mildFrac)}</td>
            </tr>
            <tr>
              <td>{t('Severe')} [%]: </td>
              <td>{percentageFormatter(severeFrac)}</td>
            </tr>
            <tr>
              <td>{t('Critical')} [%]: </td>
              <td>{percentageFormatter(criticalFrac)}</td>
            </tr>
            <tr>
              <td>{t('Fatal')} [%]: </td>
              <td>{percentageFormatter(deathFrac)}</td>
            </tr>
          </tbody>
        </table>
      </Col>
      <Col lg={6}>
        <h3>{t('Totals/Peak')}</h3>
        <table>
          <thead>
            <tr>
              <th>{t('Quantity')} &emsp; </th>
              <th>{t('Peak/total value')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('Total death')}: </td>
              <td>{totalFormatter(totalDeath)}</td>
            </tr>
            <tr>
              <td>{t('Total severe')}: </td>
              <td>{totalFormatter(totalSevere)}</td>
            </tr>
            <tr>
              <td>{t('Peak severe')}: </td>
              <td>{totalFormatter(peakSevere)}</td>
            </tr>
            <tr>
              <td>{t('Peak critical')}: </td>
              <td>{totalFormatter(peakCritical)}</td>
            </tr>
          </tbody>
        </table>
      </Col>
    </Row>
  )
}
