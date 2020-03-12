import React from 'react'

import { FormikErrors, FormikTouched } from 'formik'
import moment from 'moment'
import { Col, Row } from 'reactstrap'
import { AnyAction } from 'typescript-fsa'

import { CardWithDropdown } from '../../Form/CardWithDropdown'
import { CollapsibleCard } from '../../Form/CollapsibleCard'
import { FormDatePicker } from '../../Form/FormDatePicker'
import { FormDropdown, FormDropdownOption } from '../../Form/FormDropdown'
import { FormSpinBox } from '../../Form/FormSpinBox'
import {
  ContainControl,
  makeTimeSeries,
  TimeSeries,
} from '../Containment/Containment'

import { SeverityTable, SeverityTableRow } from './SeverityTable'

import {
  setContainmentData,
  setContainmentScenario,
  setEpidemiologicalScenario,
  setOverallScenario,
  setPopulationScenario,
} from '../state/actions'
import { State } from '../state/state'

import countryAgeDistribution from '../../../assets/data/country_age_distribution.json'

export function stringToOption(value: string): FormDropdownOption<string> {
  return { value, label: value }
}

export function stringsToOptions(
  values: string[],
): FormDropdownOption<string>[] {
  return values.map(stringToOption)
}

// function reductionToTimeSeries(scenarioState: State) {
//   return scenarioState.containment.data.reduction.map(y => ({ y }))
// }

function timeSeriesToReduction(timeSeries: TimeSeries) {
  return timeSeries.map(timePoint => timePoint.y)
}

const countries = Object.keys(countryAgeDistribution)
const countryOptions = countries.map(country => ({ value: country, label: country })) // prettier-ignore

const months = moment.months()
const monthOptions = months.map((month, i) => ({ value: i, label: month })) // prettier-ignore

export interface ScenarioCardProps {
  severity: SeverityTableRow[]
  scenarioState: State
  errors?: FormikErrors<any>
  touched?: FormikTouched<any>
  setSeverity(severity: SeverityTableRow[]): void
  scenarioDispatch(action: AnyAction): void
}

function ScenarioCard({
  severity,
  scenarioState,
  errors,
  touched,
  setSeverity,
  scenarioDispatch,
}: ScenarioCardProps) {
  function handleChangeOverallScenario(newOverallScenario: string) {
    scenarioDispatch(setOverallScenario({ scenarioName: newOverallScenario })) // prettier-ignore
  }

  function handleChangePopulationScenario(newPopulationScenario: string) {
    scenarioDispatch(setPopulationScenario({ scenarioName: newPopulationScenario })) // prettier-ignore
  }

  function handleChangeEpidemiologicalScenario(
    newEpidemiologicalScenario: string,
  ) {
    scenarioDispatch(setEpidemiologicalScenario({ scenarioName: newEpidemiologicalScenario })) // prettier-ignore
  }

  function handleChangeContainmentScenario(newContainmentScenario: string) {
    scenarioDispatch(setContainmentScenario({ scenarioName: newContainmentScenario })) // prettier-ignore
  }

  function handleChangeContainmentData(timeSeries: TimeSeries) {
    const reduction = timeSeriesToReduction(timeSeries)
    scenarioDispatch(setContainmentData({ data: { reduction } }))
  }

  const containmentData = makeTimeSeries(
    scenarioState.simulation.data.simulationTimeRange.tMin,
    scenarioState.simulation.data.simulationTimeRange.tMax,
    scenarioState.containment.data.reduction,
  )

  const overallScenarioOptions = stringsToOptions(scenarioState.overall.scenarios) // prettier-ignore
  const populationScenarioOptions = stringsToOptions(scenarioState.population.scenarios) // prettier-ignore
  const epidemiologicalScenarioOptions = stringsToOptions(scenarioState.epidemiological.scenarios) // prettier-ignore
  const containmentScenarioOptions = stringsToOptions(scenarioState.containment.scenarios) // prettier-ignore

  return (
    <CardWithDropdown
      identifier="overallScenario"
      label={<h3 className="p-0 m-0 d-inline text-truncate">Scenario</h3>}
      help="Combination of population, epidemiology, and mitigation scenarios"
      options={overallScenarioOptions}
      value={overallScenarioOptions.find(s => s.label === scenarioState.overall.current)} // prettier-ignore
      onValueChange={handleChangeOverallScenario}
    >
      <>
        <Row noGutters>
          <Col xl={6} className="py-1 px-1">
            <CardWithDropdown
              identifier="populationScenario"
              label={
                <h5 className="p-0 m-0 d-inline text-truncate">Population</h5>
              }
              help="Parameters of the population in the health care system."
              options={populationScenarioOptions}
              value={populationScenarioOptions.find(s => s.label === scenarioState.population.current)} // prettier-ignore
              onValueChange={handleChangePopulationScenario}
            >
              <FormSpinBox
                identifier="population.populationServed"
                label="Population"
                help="Number of people served by health care system"
                step={1000}
                errors={errors}
                touched={touched}
              />
              <FormDropdown<string>
                identifier="population.country"
                label="Age Distribution"
                help="Country to determine the age distribution in the population"
                options={countryOptions}
                errors={errors}
                touched={touched}
              />
              <FormSpinBox
                identifier="population.suspectedCasesToday"
                label="Initial suspected Cases"
                help="Number of cases present at the start of simulation"
                step={1}
                errors={errors}
                touched={touched}
              />
              <FormSpinBox
                identifier="population.importsPerDay"
                label="Imports per Day"
                help="Number of cases imported from the outside per day on average"
                step={0.1}
                errors={errors}
                touched={touched}
              />
              <FormDatePicker
                identifier="simulation.simulationTimeRange"
                label="Simulation time range"
                help="Start and end date of the simulation"
              />
              <p>
                NOTE: Changing the time range will stretch the mitigation curve
              </p>
            </CardWithDropdown>
          </Col>

          <Col xl={6} className="py-1 px-1">
            <CardWithDropdown
              identifier="epidemiologicalScenario"
              label={
                <h5 className="p-0 d-inline text-truncate">{'Epidemiology'}</h5>
              }
              help="Epidemiological parameters specifing growth rate, seasonal variation, and duration of hospital stay. The presets are combinations of speed and geography (speed/region)."
              options={epidemiologicalScenarioOptions}
              value={epidemiologicalScenarioOptions.find(s => s.label === scenarioState.epidemiological.current)} // prettier-ignore
              onValueChange={handleChangeEpidemiologicalScenario}
            >
              <FormSpinBox
                identifier="epidemiological.r0"
                label="Annual average R0"
                help="Average number of secondary infections per case"
                step={0.1}
                errors={errors}
                touched={touched}
              />
              <FormSpinBox
                identifier="epidemiological.incubationTime"
                label="Latency [days]"
                help="Time from infection to onset of symptoms (here onset of infectiousness)"
                step={1}
                min={0}
                errors={errors}
                touched={touched}
              />
              <FormSpinBox
                identifier="epidemiological.infectiousPeriod"
                label="Infectious Period [days]"
                help="Average number of days a person is infectious. Together with the incubation time, this defines the serial interval"
                step={1}
                min={0}
                errors={errors}
                touched={touched}
              />
              <FormSpinBox
                identifier="epidemiological.seasonalForcing"
                label="Seasonal Forcing"
                help="Amplitude of seasonal variation in transmission"
                step={0.1}
                min={0}
                errors={errors}
                touched={touched}
              />
              <FormDropdown<number>
                identifier="epidemiological.peakMonth"
                label="Seasonal Transmission Peak"
                help="Time of the year with peak transmission"
                options={monthOptions}
                errors={errors}
                touched={touched}
              />
              <FormSpinBox
                identifier="epidemiological.lengthHospitalStay"
                label="Length of Hospital stay [days]"
                help="Average number of days a severe case stays in regular hospital beds"
                step={1}
                min={0}
                errors={errors}
                touched={touched}
              />
              <FormSpinBox
                identifier="epidemiological.lengthICUStay"
                label="Length of ICU stay [days]"
                help="Average number of days a critical case stays in the ICU"
                step={1}
                min={0}
                errors={errors}
                touched={touched}
              />
            </CardWithDropdown>
          </Col>
        </Row>

        <Row noGutters>
          <Col className="py-1 px-1">
            <CardWithDropdown
              identifier="containmentScenario"
              label={<h5 className="p-0 d-inline text-truncate">Mitigation</h5>}
              help="Reduction of transmission through mitigation measures over time. Different presets with variable degree of reduction can be selected from the dropdown."
              options={containmentScenarioOptions}
              value={containmentScenarioOptions.find(s => s.label === scenarioState.containment.current)} // prettier-ignore
              onValueChange={handleChangeContainmentScenario}
            >
              <div className="w-auto">
                <ContainControl
                  data={containmentData}
                  onDataChange={handleChangeContainmentData}
                  minTime={scenarioState.simulation.data.simulationTimeRange.tMin} // prettier-ignore
                  maxTime={scenarioState.simulation.data.simulationTimeRange.tMax} // prettier-ignore
                />
              </div>
              <div>
                <p>
                  Drag black dots with the mouse to simulate how infection
                  control affects the outbreak trajectory. One is no infection
                  control, zero is complete prevention of all transmission.
                </p>
              </div>
            </CardWithDropdown>
          </Col>
        </Row>

        <Row noGutters>
          <Col className="py-1 px-1">
            <CollapsibleCard
              identifier="severity-card"
              title={
                <>
                  <h5 className="my-1">Severity assumptions</h5>
                  <p className="my-0">based on data from China</p>
                </>
              }
              help="Assumptions on severity which are informed by epidemiological and clinical observations in China"
              defaultCollapsed
            >
              <p>
                This table summarizes the assumptions on severity which are
                informed by epidemiological and clinical observations in China.
                The first column reflects our assumption on what fraction of
                infections are reflected in the statistics from China, the
                following columns contain the assumption on what fraction of the
                previous category deteriorates to the next. These fields are
                editable and can be adjusted to different assumptions. The last
                column is the implied infection fatality for different age
                groups.
              </p>

              <SeverityTable severity={severity} setSeverity={setSeverity} />
            </CollapsibleCard>
          </Col>
        </Row>
      </>
    </CardWithDropdown>
  )
}

export { ScenarioCard }
