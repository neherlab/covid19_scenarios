import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import ReactResizeDetector from 'react-resize-detector'

import { AlgorithmResult } from '../../algorithms/Result.types'

const ASPECT_RATIO = 16 / 9

export const colors = {
  susceptible: "#a6cee3",
  infectious: "#fdbf6f",
  severe: "#fb9a99",
  critical: "#e31a1c",
  recovered: "#33a02c",
  death: "#cab2d6"
}

export interface LinePlotProps {
  data?: AlgorithmResult
  logScale?: boolean
}

export function DeterministicLinePlot({ data, logScale }: LinePlotProps) {
  if ((!data)||data.stochasticTrajectories.length>0) {
    return null
  }


  function xTickFormatter(tick: Date):string{
    return new Date(tick).toISOString().substring(0,10);
  }

  function tooltipFormatter(value, name, props){
    if (name!=='time'){
      return value;
    }
  }

  function labelFormatter(value){
    return xTickFormatter(value);
  }
  const nHospitalBeds = data.params.populationServed*4.5/1000;

  const plotData = data.deterministicTrajectory.map(x => ({
     time:  x.time,
     susceptible: Math.round(x.susceptible["total"])||undefined,
     exposed: Math.round(x.exposed["total"])||undefined,
     infectious: Math.round(x.infectious["total"])||undefined,
     hospitalized: Math.round(x.hospitalized["total"])||undefined,
     critical: Math.round(x.critical["total"])||undefined,
     recovered: Math.round(x.recovered["total"])||undefined,
     dead: Math.round(x.dead["total"])||undefined,
     hospitalBeds: nHospitalBeds
   }))

  const logScaleString = logScale?"log":"linear";
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
            <h3>Cases through time</h3>
            <LineChart
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                tickFormatter={xTickFormatter}
                tickCount={4}
              />
              <YAxis scale={logScaleString}  type="number" domain={[1, 'dataMax']} />
              <Tooltip formatter={tooltipFormatter} labelFormatter={labelFormatter}/>
              <Legend />
              <Line dot={false} type="monotone" strokeWidth={3} dataKey="susceptible" stroke={colors["susceptible"]} name="Susceptible"/>
              <Line dot={false} type="monotone" strokeWidth={3} dataKey="infectious" stroke={colors["infectious"]} name="Infectious"/>
              <Line dot={false} type="monotone" strokeWidth={3} dataKey="severe" stroke={colors["severe"]} name="Severly ill"/>
              <Line dot={false} type="monotone" strokeWidth={3} dataKey="critical" stroke={colors["critical"]} name="Critically ill"/>
              <Line dot={false} type="monotone" strokeWidth={3} dataKey="dead" stroke={colors["death"]} name="Cumulative deaths"/>
              <Line dot={false} type="monotone" strokeWidth={3} dataKey="recovered" stroke={colors["recovered"]} name="Recovered"/>
              <Line dot={false} type="monotone" strokeWidth={3} dataKey="hospitalBeds" stroke="#aaaaaa" name="Hospital beds (OECD average)"/>
            </LineChart>
            </>
          )
        }}
      </ReactResizeDetector>
    </div>
  )
}

