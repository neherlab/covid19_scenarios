import type { CaseCountsDatum } from '../../../algorithms/types/Param.types'

export type MaybeNumber = number | undefined

export function verifyPositive(x: number): MaybeNumber {
  const xRounded = Math.round(x)
  return xRounded > 0 ? xRounded : undefined
}

export function verifyTuple(x: [MaybeNumber, MaybeNumber], center: MaybeNumber): [number, number] | undefined {
  const [lo, up] = x
  const mi = center ? verifyPositive(center) : undefined

  if (lo !== undefined && up !== undefined && mi !== undefined) {
    // prettier-ignore
    return [
      lo < mi ? lo : mi,
      up > mi ? up : mi,
    ]
  }

  if (lo !== undefined && up !== undefined) {
    return [lo, up]
  }

  if (lo === undefined && up !== undefined && mi !== undefined) {
    return [0.0001, up > mi ? up : mi]
  }

  if (lo === undefined && up !== undefined) {
    return [0.0001, up]
  }

  return undefined
}

export function computeNewEmpiricalCases(
  timeWindow: number,
  field: string,
  cumulativeCounts?: CaseCountsDatum[],
): [MaybeNumber[], number] {
  const newEmpiricalCases: MaybeNumber[] = []
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

    const nowCases = cumulativeCounts[day][field]
    const oldCases = cumulativeCounts[startDay][field]
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
