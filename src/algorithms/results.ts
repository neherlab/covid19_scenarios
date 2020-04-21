import { ExportedTimePoint } from './types/Result.types'

// -----------------------------------------------------------------------
// Simulation data methods

/* Constructors */
function emptyTimePoint(t: number): ExportedTimePoint {
  return {
    time: t, // Dummy
    current: {
      susceptible: {},
      severe: {},
      critical: {},
      exposed: {},
      infectious: {},
      overflow: {},
    },
    cumulative: {
      recovered: {},
      critical: {},
      hospitalized: {},
      fatality: {},
    },
  }
}

export function emptyTrajectory(len: number): ExportedTimePoint[] {
  const arr: ExportedTimePoint[] = []
  while (arr.length < len) {
    arr.push(emptyTimePoint(Date.now()))
  }

  return arr
}

/* Binary operations */
function operationTP(
  x: ExportedTimePoint,
  y: ExportedTimePoint,
  operator: (dict: Record<string, number>, other: Record<string, number>) => Record<string, number>,
) {
  return {
    time: y.time,
    current: {
      susceptible: operator(x.current.susceptible, y.current.susceptible),
      severe: operator(x.current.severe, y.current.severe),
      exposed: operator(x.current.exposed, y.current.exposed),
      critical: operator(x.current.critical, y.current.critical),
      overflow: operator(x.current.overflow, y.current.overflow),
      infectious: operator(x.current.infectious, y.current.infectious),
    },
    cumulative: {
      critical: operator(x.cumulative.critical, y.cumulative.critical),
      fatality: operator(x.cumulative.fatality, y.cumulative.fatality),
      recovered: operator(x.cumulative.recovered, y.cumulative.recovered),
      hospitalized: operator(x.cumulative.hospitalized, y.cumulative.hospitalized),
    },
  }
}

export function addTP(x: ExportedTimePoint, y: ExportedTimePoint): ExportedTimePoint {
  return operationTP(
    x,
    y,
    (dict: Record<string, number>, other: Record<string, number>): Record<string, number> => {
      const s: Record<string, number> = {}
      Object.keys(other).forEach((k) => {
        if (!(k in dict)) {
          s[k] = other[k]
        } else {
          s[k] = dict[k] + other[k]
        }
      })

      return s
    },
  )
}

export function subTP(x: ExportedTimePoint, y: ExportedTimePoint): ExportedTimePoint {
  return operationTP(
    x,
    y,
    (dict: Record<string, number>, other: Record<string, number>): Record<string, number> => {
      const s: Record<string, number> = {}
      Object.keys(other).forEach((k) => {
        if (!(k in dict)) {
          s[k] = other[k]
        } else {
          s[k] = dict[k] - other[k]
        }
      })

      return s
    },
  )
}

export function mulTP(x: ExportedTimePoint, y: ExportedTimePoint): ExportedTimePoint {
  return operationTP(
    x,
    y,
    (dict: Record<string, number>, other: Record<string, number>): Record<string, number> => {
      const s: Record<string, number> = {}
      Object.keys(dict).forEach((k) => {
        s[k] = dict[k] * other[k]
      })

      return s
    },
  )
}

export function divTP(x: ExportedTimePoint, y: ExportedTimePoint): ExportedTimePoint {
  return operationTP(
    x,
    y,
    (dict: Record<string, number>, other: Record<string, number>): Record<string, number> => {
      const s: Record<string, number> = {}
      Object.keys(dict).forEach((k) => {
        s[k] = dict[k] / other[k]
      })

      return s
    },
  )
}

/* Unary operations */
function scaleTP(x: ExportedTimePoint, transform: (x: number) => number): ExportedTimePoint {
  const scale = (dict: Record<string, number>): Record<string, number> => {
    const s: Record<string, number> = {}
    Object.keys(dict).forEach((k) => {
      s[k] = transform(dict[k])
    })

    return s
  }
  return {
    time: x.time,
    current: {
      susceptible: scale(x.current.susceptible),
      severe: scale(x.current.severe),
      exposed: scale(x.current.exposed),
      critical: scale(x.current.critical),
      overflow: scale(x.current.overflow),
      infectious: scale(x.current.infectious),
    },
    cumulative: {
      critical: scale(x.cumulative.critical),
      fatality: scale(x.cumulative.fatality),
      recovered: scale(x.cumulative.recovered),
      hospitalized: scale(x.cumulative.hospitalized),
    },
  }
}

/* N-ary operations (TP -> TPs) */
function scaledMeanTPs(
  tps: ExportedTimePoint[],
  fwd: (x: number) => number,
  inv: (x: number) => number,
): ExportedTimePoint {
  const N = tps.length

  let mean: ExportedTimePoint = emptyTimePoint(tps[0].time)
  tps.forEach((tp) => {
    mean = addTP(mean, scaleTP(tp, fwd))
  })
  mean = scaleTP(mean, (x) => inv(x / N))

  return mean
}

function scaledStdDevTPs(
  tps: ExportedTimePoint[],
  mean: ExportedTimePoint,
  fwd: (x: number) => number,
  inv: (x: number) => number,
): ExportedTimePoint {
  const N = tps.length
  const M = scaleTP(mean, (x) => -fwd(x))

  let logvar: ExportedTimePoint = emptyTimePoint(tps[0].time)
  tps.forEach((tp) => {
    logvar = addTP(
      logvar,
      scaleTP(
        addTP(
          scaleTP(tp, (x) => fwd(x + COUNT_FLOOR)),
          M,
        ),
        (x) => x * x,
      ),
    )
  })

  const logstd = scaleTP(logvar, (x) => Math.pow(x / N, 1 / 2))

  return scaleTP(logstd, inv)
}

export function percentileTPs(tps: ExportedTimePoint[], prc: number): ExportedTimePoint {
  const res: ExportedTimePoint = emptyTimePoint(tps[0].time)
  const idx = Math.ceil(prc * (tps.length - 1))

  Object.keys(tps[0]).forEach((kind) => {
    Object.keys(tps[0][kind]).forEach((k) => {
      Object.keys(tps[0][kind][k]).forEach((age) => {
        res[kind][k][age] = tps.map((d) => d[kind][k][age]).sort((x, y) => x - y)[idx]
      })
    })
  })

  return res
}

// -----------------------------------------------------------------------
// Operations on sets of realizations

export function percentileTrajectory(trajectories: ExportedTimePoint[][], prc: number): ExportedTimePoint[] {
  return trajectories[0].map((_, i) => {
    return percentileTPs(
      trajectories.map((traj) => traj[i]),
      prc,
    )
  })
}

const COUNT_FLOOR = 1e-1
const fwdTransform = (x: number) => Math.log(x + COUNT_FLOOR)
const invTransform = (x: number) => Math.exp(x)

export function meanTrajectory(trajectories: ExportedTimePoint[][]): ExportedTimePoint[] {
  return trajectories[0].map((_, i) => {
    return scaledMeanTPs(
      trajectories.map((_, j) => trajectories[j][i]),
      fwdTransform,
      invTransform,
    )
  })
}

export function stddevTrajectory(trajectories: ExportedTimePoint[][], mean: ExportedTimePoint[]): ExportedTimePoint[] {
  return trajectories[0].map((_, i) => {
    return scaledStdDevTPs(
      trajectories.map((_, j) => trajectories[j][i]),
      mean[i],
      fwdTransform,
      invTransform,
    )
  })
}
