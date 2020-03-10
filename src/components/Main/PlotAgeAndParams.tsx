import React from 'react'

import Plot from 'react-plotly.js'
import {round, pow} from 'mathjs'

import { AlgorithmResult } from '../../algorithms/Result.types'
import { SeverityTableRow } from '../../components/Main/SeverityTable'

export interface SimProps {
  data?: AlgorithmResult,
  rates?: SeverityTableRow[]
}

export default function AgePlot( {data, rates}: SimProps ) {
  if (!data|| !rates) { return null; }
  const params = data.params;

  const keepSigFigs = (x:number, num:number):number => { return round(x*pow(10, num)) / pow(10, num); };

  const ages = Object.keys(params.ageDistribution).map(x => x);
  const agesFrac = ages.map(x => keepSigFigs(params.ageDistribution[x], 4));
  const sevFrac = ages.map(x => params.infectionSeverityRatio[x]);

  if (Object.keys(data.deterministicTrajectory[data.deterministicTrajectory.length-1].dead).length == 1) {
      let Z = sevFrac.reduce((a,b) => a + b, 0);
      const probSevere = sevFrac.map((x) => x / Z);
      var probDeath = rates.map((x, i) => x.fatal / 100 * agesFrac[i]);
      probDeath = probDeath.map((x, i) => (x * probSevere[i]));
      Z = probDeath.reduce((a,b) => a + b, 0);
      probDeath = probDeath.map((x) => x / Z);

      const totalDeaths = data.deterministicTrajectory[data.deterministicTrajectory.length-1].dead["total"];
      const totalSevere = data.deterministicTrajectory[data.deterministicTrajectory.length-1].discharged["total"] + totalDeaths;
      const peakSevere = Math.max(...(data.deterministicTrajectory.map( x => x.hospitalized["total"])));

      var ageDeaths = probDeath.map(x => round(totalDeaths * x));
      var ageSevere = probSevere.map((x, i) => round(totalSevere * x) + ageDeaths[i]);
      var agePeakSevere = probSevere.map(x => round(peakSevere * x));
  } else {
      var ageDeaths = ages.map(x => round(data.deterministicTrajectory[data.deterministicTrajectory.length-1].dead[x]));
      var ageSevere = ages.map((x,i) => round(data.deterministicTrajectory[data.deterministicTrajectory.length-1].discharged[x]) + ageDeaths[i]);
      var agePeakSevere = ages.map(k => round(Math.max(...(data.deterministicTrajectory.map(x => x.hospitalized[k])))));
  }

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
          name: 'Total deaths',
        },
        {
          x: ages,
          y: agePeakSevere,
          xaxis: 'x2',
          yaxis: 'y2',
          type: 'bar',
          line: { color: '#DFFAC1', width: 2 },
          marker: { color: '#DFFAC1', size: 3 },
          name: 'Peak hospitalizations',
        },
        {
          x: ages,
          y: ageSevere,
          xaxis: 'x2',
          yaxis: 'y2',
          type: 'bar',
          line: { color: '#FFDAC1', width: 2 },
          marker: { color: '#FFDAC1', size: 3 },
          name: 'Total hospitalizations',
        }
      ]}
      layout={{
        grid: {
            rows: 2,
            columns: 1,
            pattern: "independent"
        },
        xaxis: {
          tickmode: 'linear',
          automargin: true,
        },
        yaxis: {
            title: "Fraction of population",
            ymax: 0.25,
            automargin: true
        },
        xaxis2: {
            tickmode: 'linear',
            title: "Age group",
            automargin: true
        },
        yaxis2: {
            title: "Number of Individuals",
            type: "log",
            automargin: true
        },
        autosize: false,
        margin: {
            l: 10,
            r: 10,
            b: 10,
            t: 10,
            pad: 4
          },
      }}
    />
  )
}
