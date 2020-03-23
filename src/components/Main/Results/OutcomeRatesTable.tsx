import React from 'react'

import { useTranslation } from 'react-i18next'

import { Col, Row } from 'reactstrap'

import { AlgorithmResult } from '../../../algorithms/types/Result.types'

import { SeverityTableRow } from '../Scenario/SeverityTable'

export interface TableProps {
  result?: AlgorithmResult
  rates?: SeverityTableRow[]
}

// FIXME: Use display format library instead
const forDisplay = (x: number) => {
  return Number((100 * x).toFixed(2))
}

export function OutcomeRatesTable({ result, rates }: TableProps) {
  const { t } = useTranslation()

  if (!result || !rates) {
    return null
  }
  const { t } = useTranslation()

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

  const endResult = result.deterministicTrajectory[result.deterministicTrajectory.length-1];

  // FIXME: should use display format library instead of rounding
  const totalDeath    = Math.round(endResult.dead.total)
  const totalSevere   = Math.round(endResult.discharged.total)
  const totalCritical = Math.round(endResult.intensive.total)
  const totalCases    = Math.round(endResult.recovered.total) + totalDeath

  let severeFrac   = 1.0*totalSevere / totalCases
  let criticalFrac = 1.0*totalCritical / totalCases
  let deathFrac    = 1.0*totalDeath / totalCases
  let mildFrac     = 1 - severeFrac - criticalFrac - deathFrac

  const peakSevere   = Math.round(Math.max(...result.deterministicTrajectory.map((x) => x.hospitalized.total)))
  const peakCritical = Math.round(Math.max(...result.deterministicTrajectory.map((x) => x.critical.total + x.overflow.total)))

  deathFrac    = forDisplay(deathFrac)
  criticalFrac = forDisplay(criticalFrac)
  severeFrac   = forDisplay(severeFrac)
  mildFrac     = forDisplay(mildFrac)

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
              <td>{mildFrac}</td>
            </tr>
            <tr>
              <td>{t('Severe')} [%]: </td>
              <td>{severeFrac}</td>
            </tr>
            <tr>
              <td>{t('Critical')} [%]: </td>
              <td>{criticalFrac}</td>
            </tr>
            <tr>
              <td>{t('Fatal')} [%]: </td>
              <td>{deathFrac}</td>
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
              <td>{totalDeath}</td>
            </tr>
            <tr>
              <td>{t('Total severe')}: </td>
              <td>{totalSevere}</td>
            </tr>
            <tr>
              <td>{t('Peak severe')}: </td>
              <td>{peakSevere}</td>
            </tr>
            <tr>
              <td>{t('Peak critical')}: </td>
              <td>{peakCritical}</td>
            </tr>
          </tbody>
        </table>
      </Col>
    </Row>
  )
}
