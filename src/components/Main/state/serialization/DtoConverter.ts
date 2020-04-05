/**
 * Conversion layer responsible of packing/unpacking the persistable state to/from DTO
 * DTO = data transfer object
 *
 * Note: This layer doesn't deal with:
 * - Date to Epoch timestamp conversion
 * - serialization to string
 */

import { PersistedStateDto, PersistedState } from '../../../../algorithms/types/Param.types'

export const toDto = (state: PersistedState): PersistedStateDto => {
  return {
    current: state.current,
    containment: state.data.containment.reduction,
    population: state.data.population,
    epidemiological: state.data.epidemiological,
    simulation: state.data.simulation,
  }
}

export const fromDto = (persisted: PersistedStateDto): PersistedState => {
  const reduction = persisted.containment

  return {
    current: persisted.current,
    data: {
      containment: {
        reduction,
        numberPoints: reduction.length,
      },
      population: persisted.population,
      epidemiological: persisted.epidemiological,
      simulation: persisted.simulation,
    },
  }
}
