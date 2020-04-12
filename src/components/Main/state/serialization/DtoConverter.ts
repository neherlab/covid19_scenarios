/**
 * Conversion layer responsible of:
 * - packing/unpacking the persistable state to/from DTO
 * - Date to Epoch timestamp conversion
 *
 * DTO = data transfer object
 *
 * Note: This layer doesn't deal with:
 * - serialization to string
 */

import { cloneDeep } from 'lodash'
import { PersistedState } from './types/PersistedState.types'
import { PersistedStateDto, MitigationIntervalDto } from './types/PersistedStateDto.types'
import { MitigationInterval } from '../../../../algorithms/types/Param.types'

/**
 * Note: the type of timeRange tMin and tMax should be Date
 * Currently some of the values values are strings instead of dates (bug!?!)
 * The following two functions are a current necessity so the app doesn't crash
 * TODO Find the root cause of strings in place of dates and fix it. We could remove this code afterwards.
 */
const getTime = (potentialDate: Date | string): number => {
  if (typeof potentialDate === 'string') {
    return new Date(potentialDate).getTime()
  }

  try {
    return potentialDate.getTime()
  } catch (error) {
    //
  }

  return 0
}

const getDate = (potentialEpoch: number | undefined): Date => {
  return potentialEpoch ? new Date(potentialEpoch) : new Date(0) // epoch zero (1 January 1970)
}

export const toDto = (state: PersistedState): PersistedStateDto => {
  const clone: PersistedState = cloneDeep(state) // do not mutate the original state
  const { simulationTimeRange } = clone.data.simulation

  return {
    current: clone.current,
    containment: clone.data.containment.mitigationIntervals.map((mitigationInterval: MitigationInterval) => ({
      id: mitigationInterval.id,
      name: mitigationInterval.name,
      color: mitigationInterval.color,
      mitigationValue: mitigationInterval.mitigationValue,
      timeRange: {
        tMin: getTime(mitigationInterval.timeRange.tMin),
        tMax: getTime(mitigationInterval.timeRange.tMax),
      },
    })),
    population: clone.data.population,
    epidemiological: clone.data.epidemiological,
    simulation: {
      simulationTimeRange: {
        tMin: getTime(simulationTimeRange.tMin),
        tMax: getTime(simulationTimeRange.tMax),
      },
      numberStochasticRuns: clone.data.simulation.numberStochasticRuns,
    },
    ageDistribution: clone.ageDistribution,
  }
}

export const fromDto = (dto: PersistedStateDto): PersistedState => {
  return {
    current: dto.current,
    data: {
      containment: {
        mitigationIntervals: dto.containment.map((mitigationInterval: MitigationIntervalDto) => ({
          id: mitigationInterval.id,
          name: mitigationInterval.name,
          color: mitigationInterval.color,
          mitigationValue: mitigationInterval.mitigationValue,
          timeRange: {
            tMin: getDate(mitigationInterval.timeRange.tMin),
            tMax: getDate(mitigationInterval.timeRange.tMax),
          },
        })),
      },
      population: dto.population,
      epidemiological: dto.epidemiological,
      simulation: {
        simulationTimeRange: {
          tMin: getDate(dto.simulation.simulationTimeRange.tMin),
          tMax: getDate(dto.simulation.simulationTimeRange.tMax),
        },
        numberStochasticRuns: dto.simulation.numberStochasticRuns,
      },
    },
    ageDistribution: dto.ageDistribution,
  }
}
