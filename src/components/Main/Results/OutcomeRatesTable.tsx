import React from 'react'

import { Col, Row } from 'reactstrap'

import { AlgorithmResult } from '../../../algorithms/Result.types'

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
  if (!result || !rates) {
    return null
  }
  const { params } = result

  /*
  // FIXME: This looks like a prefix sum. Should we use `Array.reduce()` or a library instead?
  let deathFrac    = 0
  let severeFrac   = 0
  let criticalFrac = 0

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

  const peakSevere   = Math.round(Math.max(...result.deterministicTrajectory.map(x => x.hospitalized.total)))
  const peakCritical = Math.round(Math.max(...result.deterministicTrajectory.map(x => x.critical.total + x.overflow.total)))

  deathFrac    = forDisplay(deathFrac)
  criticalFrac = forDisplay(criticalFrac)
  severeFrac   = forDisplay(severeFrac)
  mildFrac     = forDisplay(mildFrac)

  // TODO: replace this with the table component (similar to severity table)
  return (
    <Row>
      <Col lg={6}>
        <h5>Proportions</h5>
        <table>
          <thead>
            <tr>
              <th>Outcome &emsp; </th>
              <th>Population average</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mild [%]: </td>
              <td>{mildFrac}</td>
            </tr>
            <tr>
              <td>Severe [%]: </td>
              <td>{severeFrac}</td>
            </tr>
            <tr>
              <td>Critical [%]: </td>
              <td>{criticalFrac}</td>
            </tr>
            <tr>
              <td>Fatal [%]: </td>
              <td>{deathFrac}</td>
            </tr>
          </tbody>
        </table>
      </Col>
      <Col lg={6}>
        <h5>Totals/Peak</h5>
        <table>
          <thead>
            <tr>
              <th>Quantity &emsp; </th>
              <th>Peak/total value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Total death: </td>
              <td>{totalDeath}</td>
            </tr>
            <tr>
              <td>Total severe: </td>
              <td>{totalSevere}</td>
            </tr>
            <tr>
              <td>Peak severe: </td>
              <td>{peakSevere}</td>
            </tr>
            <tr>
              <td>Peak critical: </td>
              <td>{peakCritical}</td>
            </tr>
          </tbody>
        </table>
      </Col>
    </Row>
  )
}
