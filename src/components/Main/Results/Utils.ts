import type { CaseCountsDatum } from '../../../algorithms/types/Param.types'

export type maybeNumber = number | undefined

export function verifyPositive(x: number): maybeNumber {
  const xRounded = Math.round(x)
  return xRounded > 0 ? xRounded : undefined
}

export function verifyTuple(x: [maybeNumber, maybeNumber], center: maybeNumber): [number, number] | undefined {
  const centerVal = center ? verifyPositive(center) : undefined
  if (x[0] !== undefined && x[1] !== undefined && centerVal !== undefined) {
    return [x[0] < centerVal ? x[0] : centerVal, x[1] > centerVal ? x[1] : centerVal]
  }
  if (x[0] !== undefined && x[1] !== undefined) {
    return [x[0], x[1]]
  }
  if (x[0] === undefined && x[1] !== undefined && centerVal !== undefined) {
    return [0.0001, x[1] > centerVal ? x[1] : centerVal]
  }
  if (x[0] === undefined && x[1] !== undefined) {
    return [0.0001, x[1]]
  }

  return undefined
}

export function computeNewEmpiricalCases(
  timeWindow: number,
  field: string,
  cumulativeCounts?: CaseCountsDatum[],
): [maybeNumber[], number] {
  const newEmpiricalCases: maybeNumber[] = []
  const deltaDay = Math.floor(timeWindow)
  const deltaInt = timeWindow - deltaDay

  if (!cumulativeCounts) {
    return [newEmpiricalCases, deltaDay]
  }

  cumulativeCounts.forEach((_0, day) => {
    if (day < deltaDay) {
      newEmpiricalCases[day] = undefined
      return
    }

    const startDay = day - deltaDay
    const startDayPlus = day - deltaDay - 1

    // @ts-ignore
    const nowCases = cumulativeCounts[day][field]
    // @ts-ignore
    const oldCases = cumulativeCounts[startDay][field]
    // @ts-ignore
    const olderCases = cumulativeCounts[startDayPlus] ? cumulativeCounts[startDayPlus][field] : undefined
    if (oldCases && nowCases) {
      const newCases = verifyPositive(
        olderCases ? (1 - deltaInt) * (nowCases - oldCases) + deltaInt * (nowCases - olderCases) : nowCases - oldCases,
      )
      newEmpiricalCases[day] = newCases
      return
    }
    newEmpiricalCases[day] = undefined
  })
  return [newEmpiricalCases, deltaDay]
}
