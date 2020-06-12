import type { CaseCountsDatum } from '../../../algorithms/types/Param.types'

import { verifyPositive } from '../../../algorithms/preparePlotData'

export type MaybeNumber = number | undefined

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
