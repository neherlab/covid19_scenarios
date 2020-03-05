import React from 'react'

import Plot from 'react-plotly.js'

import { AlgorithmResult } from '../../algorithms/Result.types'

export interface LinePlotProps {
  data?: AlgorithmResult
  logScale?: boolean
}

export function DeterministicLinePlot({ data, logScale }: LinePlotProps) {
  if (!data) {
    return null
  }
  const trajectory = data.deterministicTrajectory;
  const time = trajectory.map(x => new Date(x.time))
  const susceptible = trajectory.map(x => Math.round(x.susceptible))
  const exposed = trajectory.map(x => Math.round(x.exposed))
  const infectious = trajectory.map(x => Math.round(x.infectious))
  const hospitalized = trajectory.map(x => Math.round(x.hospitalized))
  const critical = trajectory.map(x => Math.round(x.critical))
  const recovered = trajectory.map(x => Math.round(x.recovered))
  const dead = trajectory.map(x => Math.round(x.dead))
  const nHospitalBeds = data.params.populationServed*4.5/1000;

  return (
    <Plot
      data={[
        {
          x: [time[0], time[time.length -1]],
          y: [nHospitalBeds, nHospitalBeds],
          type: 'scatter',
          mode: 'lines',
          line: { color: '#CCCCCC', width: 3 },
          name: 'Hospital Beds (OECD average)',
        },
        {
          x: time,
          y: susceptible,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#E2F0CB', width: 2 },
          marker: { color: '#E2F0CB', size: 3 },
          name: 'Susceptible',
          visible: 'legendonly'
        },
        {
          x: time,
          y: exposed,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#FFB7B2', width: 2 },
          marker: { color: '#FFB7B2', size: 3 },
          name: 'Exposed',
          visible: 'legendonly'
        },
        {
          x: time,
          y: infectious,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#FF9AA2', width: 2 },
          marker: { color: '#FF9AA2', size: 3 },
          name: 'Cases',
        },
        {
          x: time,
          y: hospitalized,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#FFDAC1', width: 2 },
          marker: { color: '#FFDAC1', size: 3 },
          name: 'Severe',
        },
        {
          x: time,
          y: critical,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#FFDAC1', width: 2 },
          marker: { color: '#FFDAC1', size: 3 },
          name: 'Critical',
        },
        {
          x: time,
          y: recovered,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#B5EAD7', width: 2 },
          marker: { color: '#B5EAD7', size: 3 },
          name: 'Recovered (cumulative)',
          visible: 'legendonly'
        },
        {
          x: time,
          y: dead,
          type: 'scatter',
          mode: 'lines+markers',
          line: { color: '#C7CEEA', width: 2 },
          marker: { color: '#C7CEEA', size: 3 },
          name: 'Deaths (cumulative)',
        },
      ]}
      layout={{
        updatemenus: [{
            x: 0.1,
            y: 1.1,
            yanchor: 'top',
            xanchor: 'left',
            pad: {"r": 10, "t": 10},
            bgcolor: "gray",
            buttons: [
            {
                method: 'relayout',
                label: "Linear",
                args: {yaxis: { type: 'linear'} }
            },
            {
                method: 'relayout',
                label: "Log",
                args: {yaxis: { type: 'log'} }
            }]
        }],
        title: 'Deterministic Outbreak Trajectory',
        xaxis: {
          tickmode: 'linear',
          tickformat: '%Y-%m-%d',
          tickmode:'auto',
          nticks:10
          // dtick: 14 * 24 * 60 * 60 * 1000, // milliseconds
        },
        yaxis: {
            type: logScale ? 'log' : undefined
        }
      }}
    />
  )
}

export function StochasticLinePlot({ data, logScale }: LinePlotProps) {
  if (!data) {
    return null;
  }
  const trajectory = data.deterministicTrajectory;
  const time = trajectory.map(x => new Date(x.time))
  // const infectious = trajectory.map(x => Math.round(x.infectious))
  // const dead = trajectory.map(x => Math.round(x.dead))

  // TODO: Explict with types here?
  var traces = [];
  function add(data: AlgorithmResult, category: string, color: string, visible: string | Boolean) {
      var mean = time.map(() => 0);
      data.stochasticTrajectories.forEach(function(d) {
          const Y = d.map(x => Math.round(x[category]));
          mean = mean.map((x, i) => (x + Y[i]) );
          traces.push(
            {
              x: time,
              y: Y,
              type: 'line',
              opacity: 0.3,
              line: { color: color, width: 2 },
              marker: { color: color, size: 3 },
              legendgroup: category,
              showlegend: false,
              hoverinfo: 'skip',
              visible: visible,
            }
          );
      });
      mean = mean.map((x) => x / data.params.numberStochasticRuns);
      traces.push(
        {
          x: time,
          y: mean,
          type: 'line',
          line: { color: color, width: 2 },
          marker: { color: color, size: 3 },
          name: "Average number of " + category,
          visible: visible,
          legendgroup: category,
        }
      )
  }

  add(data, "susceptible", "#E2F0CB", "legendonly");
  add(data, "exposed", "#FFB7B2", "legendonly");
  add(data, "infectious", "#FF9AA2", true);
  add(data, "hospitalized", "#FFDAC1", true);
  add(data, "recovered", "#B5EAD7", "legendonly");
  add(data, "dead", "#C7CEEA", true);

  return (
    <Plot
      data={traces}
      layout={{
        title: 'Stochastic Outbreak Trajectories',
        xaxis: {
          tickmode: 'linear',
          tickformat: '%Y-%m-%d',
          tickmode:'auto',
          nticks:10
          // dtick: 14 * 24 * 60 * 60 * 1000, // milliseconds
        },
        yaxis: {
            type: logScale ? 'log' : undefined
        }
      }}
    />
  )
}
