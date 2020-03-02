import React from 'react'

import Plot from 'react-plotly.js'
import {round} from 'mathjs'

import { AlgorithmResult } from '../../algorithms/Result.types'
import { SeverityTableRow } from '../../components/Main/SeverityTable'

export interface SimProps {
  data?: AlgorithmResult,
  rates?: SeverityTableRow[]
}

export default function AgePlot( {data, rates}: SimProps ) {
  if (!data|| !rates) { return null; }
  const params = data.params;

  const ages = Object.keys(params.ageDistribution).map(x => x);
  const agesFrac = ages.map(x => params.ageDistribution[x]);

  var probDeath = rates.map((x, i) => x.fatal * agesFrac[i]);
  var Z = probDeath.reduce((a,b) => a + b, 0);
  probDeath = probDeath.map((x) => x / Z);

  var probHospitalized = rates.map((x, i) => x.hospitalized * agesFrac[i]);
  Z = probHospitalized.reduce((a,b) => a + b, 0);
  probHospitalized = probHospitalized.map((x) => x / Z);

  const totalDeaths = data.trajectory[data.trajectory.length-1].dead;
  const totalHospitalized = data.trajectory[data.trajectory.length-1].discharged + totalDeaths;

  const ageDeaths = probDeath.map(x => round(totalDeaths * x));
  const ageHospitalized = probHospitalized.map(x => round(totalHospitalized * x));

  return (
    <Plot
      data={[
        {
          x: ages,
          y: agesFrac,
          type: 'bar',
          line: { color: '#E2F0CB', width: 2 },
          marker: { color: '#E2F0CB', size: 3 },
          name: 'Age distribution',
        },
        {
          x: ages,
          y: ageDeaths,
          xaxis: 'x2',
          yaxis: 'y2',
          type: 'bar',
          line: { color: '#C7CEEA', width: 2 },
          marker: { color: '#C7CEEA', size: 3 },
          name: 'Distribution of deaths',
        },
        {
          x: ages,
          y: ageHospitalized,
          xaxis: 'x2',
          yaxis: 'y2',
          type: 'bar',
          line: { color: '#FFDAC1', width: 2 },
          marker: { color: '#FFDAC1', size: 3 },
          name: 'Distribution of hospitalizations',
        },
      ]}
      layout={{
        grid: {
            rows: 2,
            columns: 1,
            pattern: "independent"
        },
        xaxis: {
          tickmode: 'linear',
        },
        yaxis: {
            title: "Fraction of population"
        },
        xaxis2: {
            tickmode: 'linear',
            title: "Age group"
        },
        yaxis2: {
            title: "Number of Individuals",
            type: "log",
        }
      }}
    />
  )
}
