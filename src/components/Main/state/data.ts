import _ from 'lodash'

import { v4 as uuidv4 } from 'uuid'
import createColor from 'create-color'

import scenarios from '../../../assets/data/scenarios/scenarios.json'

import { MitigationIntervals, ScenarioData } from '../../../algorithms/types/Param.types'
import countryAgeDistributionData from '../../../assets/data/country_age_distribution.json'
import { OneCountryAgeDistribution, CountryAgeDistribution } from '../../../assets/data/CountryAgeDistribution.types'

export type Scenario = string

export const scenarioNames = Object.keys(scenarios)

export function getScenarioData(key: string): ScenarioData {
  // TODO: use schema: generate type, validate against schema on runtime
  const scenarioData = _.get(scenarios, key) as ScenarioData | null

  if (!scenarioData) {
    throw new Error(`Error: scenario "${key}" not found in JSON`)
  }

  // Add mitigation intervals field, if non existent
  // TODO: implement proper compile-time + runtime validation and deserialization
  if (_.isEmpty(scenarioData.containment.mitigationIntervals)) {
    scenarioData.containment.mitigationIntervals = []
  }

  // Convert dates, add ids and colors if missing
  // TODO: implement proper compile-time + runtime validation and deserialization
  const mitigationIntervals: MitigationIntervals = scenarioData.containment.mitigationIntervals.map((interval) => {
    let { tMin, tMax } = interval.timeRange
    tMin = new Date(tMin)
    tMax = new Date(tMax)

    // FIXME: should this be present in data or are we fine generating this every time?
    let id = interval?.id
    if (!id) {
      id = uuidv4()
    }

    // FIXME: should this be present in data or are we fine generating this every time?
    // FIXME: color may change when interval changes
    let color = interval?.color
    if (!color) {
      color = createColor(interval)
    }

    return {
      ...interval,
      id,
      color,
      timeRange: { tMin, tMax },
    }
  })

  return { ...scenarioData, containment: { mitigationIntervals } }
}

export function getAgeDistribution(country: string): OneCountryAgeDistribution {
  return (countryAgeDistributionData as CountryAgeDistribution)[country]
}
