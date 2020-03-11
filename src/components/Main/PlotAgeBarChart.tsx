import React, { PureComponent } from 'react';
import {
  BarChart, Bar, CartesianGrid, Tooltip, Legend, XAxis, YAxis
} from 'recharts';
import ReactResizeDetector from 'react-resize-detector'

import { AlgorithmResult } from '../../algorithms/Result.types'
import { colors } from './PlotRechart'

const ASPECT_RATIO = 16 / 4

export interface SimProps {
  data?: AlgorithmResult,
  rates?: SeverityTableRow[]
}

export default function AgePlot({ data, rates }: SimProps) {
  if (!data|| !rates) { return null; }
  const params = data.params;

  const ages = Object.keys(data.params.ageDistribution);
  const lastDataPoint = data.deterministicTrajectory[data.deterministicTrajectory.length-1];
  const plotData = ages.map(age => ({
    "name": age,
    "fraction": data.params.ageDistribution[age],
    "peakSevere": Math.round(Math.max(...data.deterministicTrajectory.map(x => x.hospitalized[age]))),
    "peakCritical": Math.round(Math.max(...data.deterministicTrajectory.map(x => x.critical[age]))),
    "totalDead": Math.round(lastDataPoint.dead[age]),
    }));
  console.log("agePlot",plotData);

  return (
    <div className="w-100 h-100">
      <ReactResizeDetector handleWidth handleHeight>
        {({ width }) => {
          if (!width) {
            return <div className="w-100 h-100" />
          }

          const height = width / ASPECT_RATIO

          return (
            <>
            <h3>Distribution across age groups</h3>
            <BarChart
              width={width}
              height={height}
              data={plotData}
              margin={{
                  l: 10,
                  r: 10,
                  b: 10,
                  t: 10,
                  pad: 4
                }}
              >
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="fraction" fill="#8884d8" />
            </BarChart>
            <BarChart
              width={width}
              height={height}
              data={plotData}
              margin={{
                  l: 10,
                  r: 10,
                  b: 10,
                  t: 10,
                  pad: 4
                }}
              >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="peakSevere" fill={colors["severe"]} name="peak severe"/>
              <Bar dataKey="peakCritical" fill={colors["critical"]} name="peak critical"/>
              <Bar dataKey="totalDead" fill={colors["dead"]} name="total deaths" />
            </BarChart>
            </>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}

