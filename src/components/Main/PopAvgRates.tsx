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
  var hospitalFrac = 0;
  rates.forEach(function(d) {
      const freq = params.ageDistribution[d.ageGroup];
      hospitalFrac += freq * d.hospitalized * d.confirmed / 100/ 100;
      deathFrac += freq * d.fatal * d.confirmed / 100 / 100;
  });
  var mildFrac = 1 - hospitalFrac - deathFrac;

  return (
    <Plot
      data={[
        {
            type: 'table',
            header: {
                values: [["<b>Outcome</b>"], ["<b>Fraction of cases</b>"]],
                align: "center",
                line: {width: 1, color: "black"},
                fill: {color: "grey"}
            },
            cells: {
                values: [["Mild", "Hospitalized", "Death"],
                         [mildFrac, hospitalFrac, deathFrac]],
                line: {width: 1, color: "black"},
            }
        }
      ]}
    />
  )
}
