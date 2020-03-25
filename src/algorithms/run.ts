import { OneCountryAgeDistribution } from '../assets/data/CountryAgeDistribution.types'

import { SeverityTableRow } from '../components/Main/Scenario/SeverityTable'

import { collectTotals, evolve, getPopulationParams, initializePopulation } from './model'
import { AllParamsFlat } from './types/Param.types'
import { AlgorithmResult, SimulationTimePoint } from './types/Result.types'
import { TimeSeries } from './types/TimeSeries.types'

const identity = (x: number) => x
const poisson = (x: number) => {
  throw new Error('We removed dependency on `random` package. Currently `poisson` is not implemented')
}

// NOTE: Assumes containment is sorted ascending in time.
export function interpolateTimeSeries(containment: TimeSeries): (t: Date) => number {
  const Ys = containment.map(d => d.y)
  const Ts = containment.map(d => Number(d.t)) 
  /* All needed linear algebra functions */
  type Vector = number[]
  type Matrix = number[][]
  const swap_rows = function(A: Matrix, i: number, j: number) {
      const tmp = A[i];
      A[i] = A[j];
      A[j] = tmp;
  }

  // NOTE: Assumes the matrix has already been augmented
  //       This implies the last column is b (Ax = b)
  const gj_eliminate = function(A : Matrix) : Vector {
    const m = A.length;
    const x = [];

    // Columns
    for (let k = 0; k < m; k++) {
        let i_max = 0; 
        let i_val = Number.NEGATIVE_INFINITY;
        // Column pivot
        for (let i=k; i<m; i++) {
            const val = Math.abs(A[i][k])
            if (val >i_val) {
                i_max = i;
                i_val = val;
            }
        }
        swap_rows(A, k, i_max);

        for (let i=k+1; i<m; i++) {
            let cf = (A[i][k] / A[k][k]);
            for (let j=k; j < m+1; j++) {
                A[i][j] -= A[k][j] * cf;
            }
        }
    }

    // Rows
    for (let i = m-1; i>=0; i--) {
        const val = A[i][m] / A[i][i]
        x[i] = val;
        for (let j = i-1; j >= 0; j--) {
            A[j][m] -= A[j][i] * val;
            A[j][i] = 0;
        }
    }

    console.log(A)

    return x
  }

  const getSmoothDerivatives = function(): Vector {
      // Solve for the derivatives that lead to "smoothest" interpolator
      let Mtx : Matrix = []
      for (let i = 0; i < Ys.length; i++) {
          Mtx.push([]);
          for (let j = 0; j < Ys.length+1; j++) {
              Mtx[i].push(0);
          }
      }
      const n = Mtx.length;

      for (let i = 1; i<Ts.length-1; i++) {
          Mtx[i][i-1] = 1 / (Ts[i] - Ts[i-1]);
          Mtx[i][i]   = 2 * (1/(Ts[i] - Ts[i-1]) + 1/(Ts[i+1]-Ts[i]));
          Mtx[i][i+1] = 1 / (Ts[i+1] - Ts[i]);
          Mtx[i][n]   = 3*( (Ys[i]-Ys[i-1])/((Ts[i] - Ts[i-1])*(Ts[i] - Ts[i-1]))  +  (Ys[i+1]-Ys[i])/ ((Ts[i+1] - Ts[i])*(Ts[i+1] - Ts[i])) );
      }

      Mtx[0][0] = 2/(Ts[1] - Ts[0]);
	  Mtx[0][1] = 1/(Ts[1] - Ts[0]);
	  Mtx[0][n] = 3 * (Ys[1] - Ys[0]) / ((Ts[1]-Ts[0])*(Ts[1]-Ts[0]));
		
	  Mtx[n-1][n-2] = 1/(Ts[n-1] - Ts[n-2]);
      Mtx[n-1][n-1] = 2/(Ts[n-1] - Ts[n-2]);
      Mtx[n-1][n]   = 3*(Ys[n-1] - Ys[n-2]) / ((Ts[n-1]-Ts[n-2])*(Ts[n-1]-Ts[n-2]));

      return gj_eliminate(Mtx);
  }

  const Yps = getSmoothDerivatives()

  return (t: Date) => {
    if (t <= containment[0].t){
      return containment[0].y
    } else if (t >= containment[containment.length-1].t) {
      return containment[containment.length-1].y
    } else {
      const i = containment.findIndex(d => Number(t) < Number(d.t))
     
      // Eval spline will return the function value @ t, fit to a spline
      // Requires the containment strengths (ys) and derivatives (yps) and times (ts)
      const eval_spline = (t : number) => {
          const f = (t - Ts[i-1]) / (Ts[i] - Ts[i-1])
          const a = +Yps[i-1]*(Ts[i] - Ts[i-1]) - (Ys[i]-Ys[i-1])
          const b = -Yps[i]  *(Ts[i] - Ts[i-1]) + (Ys[i]-Ys[i-1])
          const q = (1-f)*Ys[i-1] + f*Ys[i] + f*(1-f)*(a*(1-f)+b*f)

          return q
      };

      const eval_linear = (t : number) => {
          const deltaY = Ys[i] - Ys[i-1]
          const deltaT = Ts[i] - Ts[i-1]

          const dS = deltaY / deltaT
          const dT = t - Ts[i-1]

          return Ys[i-1] + dS * dT
      }

      return eval_spline(Number(t));
    }
  }
}

/**
 *
 * Entry point for the algorithm
 *
 */
export default async function run(
  params: AllParamsFlat,
  severity: SeverityTableRow[],
  ageDistribution: OneCountryAgeDistribution,
  containment: TimeSeries,
): Promise<AlgorithmResult> {
  const modelParams = getPopulationParams(params, severity, ageDistribution, interpolateTimeSeries(containment))
  const tMin: number = params.simulationTimeRange.tMin.getTime()
  const tMax: number = params.simulationTimeRange.tMax.getTime()
  const initialCases = params.suspectedCasesToday
  let initialState = initializePopulation(modelParams.populationServed, initialCases, tMin, ageDistribution)

  function simulate(initialState: SimulationTimePoint, func: (x: number) => number) {
    const dynamics = [initialState]
    while (dynamics[dynamics.length - 1].time < tMax) {
      const pop = dynamics[dynamics.length - 1]
      dynamics.push(evolve(pop, modelParams, func))
    }

    return collectTotals(dynamics)
  }

  const sim: AlgorithmResult = {
    deterministicTrajectory: simulate(initialState, identity),
    stochasticTrajectories: [],
    params: modelParams,
  }

  for (let i = 0; i < modelParams.numberStochasticRuns; i++) {
    initialState = initializePopulation(modelParams.populationServed, initialCases, tMin, ageDistribution)
    sim.stochasticTrajectories.push(simulate(initialState, poisson))
  }

  return sim
}
