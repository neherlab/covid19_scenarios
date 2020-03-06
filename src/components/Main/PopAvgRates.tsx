import React from 'react'
import Plot  from 'react-plotly.js'

import { AlgorithmResult } from '../../algorithms/Result.types'
import { SeverityTableRow } from '../../components/Main/SeverityTable'

export interface TableProps {
  result?: AlgorithmResult,
  rates?: SeverityTableRow[]
}

export default function PopTable( {result, rates}: TableProps) {
  if (!result || !rates) { return null; }
  const params = result.params;

  var deathFrac = 0;
  var severeFrac = 0;
  var criticalFrac = 0;
  rates.forEach(function(d) {
      const freq = params.ageDistribution[d.ageGroup];
      severeFrac += freq * params.infectionSeverityRatio[d.ageGroup];
      criticalFrac += freq * (d.critical / 100);
      deathFrac += freq * (d.fatal / 100);
  });
  criticalFrac *= severeFrac;
  deathFrac *= criticalFrac;
  var mildFrac = 1 - severeFrac - criticalFrac - deathFrac;

  const forDisplay = ((x: number) => { return Number((100*x).toFixed(2)); });
  deathFrac = forDisplay(deathFrac);
  severeFrac = forDisplay(severeFrac);
  mildFrac = forDisplay(mildFrac);

  const totalDeath = Math.round(result.deterministicTrajectory[result.deterministicTrajectory.length-1].dead["total"]);
  const totalSevere = Math.round(result.deterministicTrajectory[result.deterministicTrajectory.length-1].discharged["total"]);
  const peakSevere = Math.round(Math.max(...result.deterministicTrajectory.map( x => x.hospitalized["total"] )));
  const peakCritical = Math.round(Math.max(...result.deterministicTrajectory.map( x => x.critical["total"] )));

  return (
    <>
    <table>
    <thead>
    <tr>
      <th>Outcome or Value &emsp; </th>
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
      <td>Fatal [%]: </td>
      <td>{deathFrac}</td>
    </tr>
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
    </>
  )
}
