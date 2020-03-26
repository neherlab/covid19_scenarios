import React from 'react'

import { useTranslation } from 'react-i18next'

import { Col, Row } from 'reactstrap'

import * as d3 from 'd3'

import { AlgorithmResult } from '../../../algorithms/types/Result.types'

import { SeverityTableRow } from '../Scenario/SeverityTable'

import { numberFormatter } from '../../../helpers/numberFormat'

export interface TableProps {
  showHumanized?: boolean
  result?: AlgorithmResult
  rates?: SeverityTableRow[]
}

const percentageFormatter = (v: number) => d3.format('.2f')(v * 100)

export function OutcomeRatesTable({ showHumanized, result, rates }: TableProps) {
  const { t, i18n } = useTranslation()

  if (!result || !rates) {
    return null
  }

  const formatNumber = numberFormatter(i18n.language, !!showHumanized, true)

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

  const endResult = result.deterministic.trajectory[result.deterministic.trajectory.length-1];

  const totalDeath = endResult.dead.total
  const totalSevere = endResult.discharged.total
  const totalCritical = endResult.intensive.total
  const totalCases = endResult.recovered.total + totalDeath

  const severeFrac = (1.0 * totalSevere) / totalCases
  const criticalFrac = (1.0 * totalCritical) / totalCases
  const deathFrac = (1.0 * totalDeath) / totalCases
  const mildFrac = 1 - severeFrac - criticalFrac - deathFrac

  const peakSevere   = Math.round(Math.max(...result.deterministic.trajectory.map((x) => x.hospitalized.total)))
  const peakCritical = Math.round(Math.max(...result.deterministic.trajectory.map((x) => x.critical.total + x.overflow.total)))

  const totalFormatter = (value: number) => formatNumber(value)

  // TODO: replace this with the table component (similar to severity table)
  return (
    <Row data-testid="OutcomeRatesTable">
      <Col lg={6}>
        <h5>{t('Proportions')}</h5>
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
        <h5>{t('Totals/Peak')}</h5>
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
