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
  rates.forEach(function(d) {
      const freq = params.ageDistribution[d.ageGroup];
      severeFrac += freq * params.infectionSeverityRatio[d.ageGroup];
      deathFrac += freq * (d.fatal / 100);
  });
  deathFrac *= severeFrac;
  var mildFrac = 1 - severeFrac - deathFrac;

  const forDisplay = ((x: number) => { return Number((100*x).toFixed(2)); });
  deathFrac = forDisplay(deathFrac);
  severeFrac = forDisplay(severeFrac);
  mildFrac = forDisplay(mildFrac);

  const totalDeath = Math.round(result.deterministicTrajectory[result.deterministicTrajectory.length-1].dead);
  const totalSevere = Math.round(result.deterministicTrajectory[result.deterministicTrajectory.length-1].discharged);
  const peakSevere = Math.round(Math.max(...result.deterministicTrajectory.map( x => x.hospitalized )));

  return (
    <Plot
      data={[
        {
            type: 'table',
            header: {
                values: [["<b>Outcome</b>"], ["<b>Population summary</b>"]],
                align: "center",
                line: {width: 1, color: "black"},
                fill: {color: "#E5E7E9"}
            },
            cells: {
                values: [["Mild [%]", "Severe [%]", "Death [%]", "Total death", "Total severe cases", "Peak severe cases"],
                         [mildFrac, severeFrac, deathFrac, totalDeath, totalSevere, peakSevere]],
                line: {width: 1, color: "black"},
            },
            layout: {
                margin: {
                    l: 0,
                    r: 0,
                    t: 0,
                    b: 0
                }
            }
        }
      ]}
    />
  )
}
