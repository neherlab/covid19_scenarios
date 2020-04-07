import { cloneDeep, isEqual, map } from 'lodash'
import { AnyAction } from 'typescript-fsa'
import { AllParams } from '../../../../algorithms/types/Param.types'
import { setContainmentData, setPopulationData, setEpidemiologicalData, setSimulationData } from '../actions'

export const updateGraphs = (dispatchMethod: React.Dispatch<AnyAction>, oldParams: AllParams, newParams: AllParams) => {
  //console.log('=== UPDATING GRAPHS ===', newParams)

  // TODO this could probably be optimized (turned into a single action)

  // NOTE: deep object comparison!
  if (!isEqual(oldParams.population, newParams.population)) {
    // console.log('setPopulationData', newParams.population)
    dispatchMethod(setPopulationData({ data: newParams.population }))
  }
  // NOTE: deep object comparison!
  if (!isEqual(oldParams.epidemiological, newParams.epidemiological)) {
    // console.log('setEpidemiologicalData', newParams.epidemiological)
    dispatchMethod(setEpidemiologicalData({ data: newParams.epidemiological }))
  }
  // NOTE: deep object comparison!
  if (!isEqual(oldParams.simulation, newParams.simulation)) {
    // console.log('setSimulationData', newParams.simulation)
    dispatchMethod(setSimulationData({ data: newParams.simulation }))
  }
  // NOTE: deep object comparison!
  if (!isEqual(oldParams.containment, newParams.containment)) {
    // console.log('setContainmentData', newParams.containment)
    const mitigationIntervals = map(newParams.containment.mitigationIntervals, cloneDeep)
    dispatchMethod(setContainmentData({ data: { mitigationIntervals } }))
  }
}
