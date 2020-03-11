import React, { useReducer, useState } from 'react'

import _ from 'lodash'

import { Form, Formik, FormikHelpers } from 'formik'
import moment from 'moment'
import * as yup from 'yup'

import { Button, Col, FormGroup, Row } from 'reactstrap'

import { CardWithDropdown } from './CardWithDropdown'
import { CollapsibleCard } from './CollapsibleCard'
import AgePlot from './PlotAgeBarChart'
import { ContainControl, makeTimeSeries, TimeSeries } from './Containment'
import { DeterministicLinePlot } from './Plot'
// import { StochasticLinePlot } from './Plot'

import PopTable from './PopAvgRates'

import SeverityTable, { SeverityTableColumn, SeverityTableRow } from './SeverityTable' // prettier-ignore

import { exportResult } from '../../algorithms/exportResult'
import run from '../../algorithms/run'

import { AllParams } from '../../algorithms/Param.types'

import countryAgeDistribution from '../../assets/data/country_age_distribution.json'
import severityData from '../../assets/data/severityData.json'

import { AlgorithmResult } from '../../algorithms/Result.types'

import FormDatePicker from './FormDatePicker'
import FormDropdown, { FormDropdownOption } from './FormDropdown'
import FormSpinBox from './FormSpinBox'
import FormSwitch from './FormSwitch'

import { schema } from './validation/schema'

import {
  setContainmentData,
  setContainmentScenario,
  setEpidemiologicalData,
  setEpidemiologicalScenario,
  setOverallScenario,
  setPopulationData,
  setPopulationScenario,
  setSimulationData,
} from './state/actions'
import { scenarioReducer } from './state/reducer'
import { defaultScenarioState, State } from './state/state'

import './Main.scss'

const columns: SeverityTableColumn[] = [
  { name: 'ageGroup', title: 'Age group' },
  { name: 'confirmed', title: 'Confirmed\n% total' },
  { name: 'severe', title: 'Severe\n% of confirmed' },
  { name: 'critical', title: 'Critical\n% of severe' },
  { name: 'fatal', title: 'Fatal\n% of critical' },
  { name: 'totalFatal', title: 'Fatal\n% of all infections' },
  { name: 'isolated', title: 'Isolated \n% total' },
]

/**
 * Checks that a given value is a valid percentage number and if not, attempts
 * to cast it as such. If unsuccesful, returns a NaN and an error message.
 */
export function validatePercentage(
  value: any, // eslint-disable-line @typescript-eslint/no-explicit-any
): { value: number; errors?: string } {
  const percentageSchema = yup
    .number()
    .typeError('Percentage should be a number')
    .required('Required')
    .min(0, 'Percentage should be non-negative')
    .max(100, 'Percentage cannot be greater than 100')

  try {
    const castedValue = percentageSchema.validateSync(value)
    return { value: castedValue, errors: undefined }
  } catch (valError) {
    const validationError = valError as yup.ValidationError
    try {
      const castedValue = percentageSchema.cast(value)
      return { value: castedValue, errors: validationError.message }
    } catch (typeError) {
      return { value: NaN, errors: validationError.message }
    }
  }
}

/**
 * Updates computable columns in severity table
 */
export function updateSeverityTable(
  severity: SeverityTableRow[],
): SeverityTableRow[] {
  return severity.map(row => {
    const { value: isolated, errors: isolatedErrors } = validatePercentage(row.isolated) // prettier-ignore
    const { value: confirmed, errors: confirmedErrors } = validatePercentage(row.confirmed) // prettier-ignore
    const { value: severe, errors: severeErrors } = validatePercentage(row.severe) // prettier-ignore
    const { value: critical, errors: criticalErrors } = validatePercentage(row.critical) // prettier-ignore
    const { value: fatal, errors: fatalErrors } = validatePercentage(row.fatal) // prettier-ignore

    const totalFatal = confirmed * severe * critical * fatal * 1e-6

    const errors = {
      isolated: isolatedErrors,
      confirmed: confirmedErrors,
      severe: severeErrors,
      critical: criticalErrors,
      fatal: fatalErrors,
    }

    return {
      ...row,
      isolated,
      confirmed,
      severe,
      critical,
      fatal,
      totalFatal,
      errors,
    }
  })
}

export function severityTableIsValid(severity: SeverityTableRow[]) {
  return !severity.some(row => _.values(row?.errors).some(x => x !== undefined))
}

export function severityErrors(severity: SeverityTableRow[]) {
  return severity.map(row => row?.errors)
}

const severityDefaults: SeverityTableRow[] = updateSeverityTable(severityData)

export function stringToOption(value: string): FormDropdownOption<string> {
  return { value, label: value }
}

export function stringsToOptions(
  values: string[],
): FormDropdownOption<string>[] {
  return values.map(stringToOption)
}

const countries = Object.keys(countryAgeDistribution)
const countryOptions = countries.map(country => ({ value: country, label: country })) // prettier-ignore

const months = moment.months()
const monthOptions = months.map((month, i) => ({ value: i, label: month })) // prettier-ignore

function reductionToTimeSeries(scenarioState: State) {
  return scenarioState.containment.data.reduction.map(y => ({ y }))
}

function timeSeriesToReduction(timeSeries: TimeSeries) {
  return timeSeries.map(timePoint => timePoint.y)
}

function Main() {
  const [logScale, setLogScale] = useState<boolean>(true)
  const [result, setResult] = useState<AlgorithmResult | undefined>()
  const [userResult, setUserResult] = useState<AlgorithmResult | undefined>()
  const [scenarioState, scenarioDispatch] = useReducer(scenarioReducer, defaultScenarioState, /* initDefaultState */) // prettier-ignore

  // TODO: Can this complex state be handled by formik too?
  const [severity, setSeverity] = useState<SeverityTableRow[]>(severityDefaults)

  const allParams = {
    population: scenarioState.population.data,
    epidemiological: scenarioState.epidemiological.data,
    simulation: scenarioState.simulation.data,
  }

  const hasResult = Boolean(result?.deterministicTrajectory)
  const hasUserResult = Boolean(userResult?.deterministicTrajectory)
  const canExport = Boolean(hasResult)

  function setScenarioToCustom(newParams: AllParams) {
    // NOTE: deep object comparison!
    if (!_.isEqual(allParams.population, newParams.population)) {
      scenarioDispatch(setPopulationData({ data: newParams.population }))
    }
    // NOTE: deep object comparison!
    if (!_.isEqual(allParams.epidemiological, newParams.epidemiological)) {
      scenarioDispatch(setEpidemiologicalData({ data: newParams.epidemiological })) // prettier-ignore
    }
    // NOTE: deep object comparison!
    if (!_.isEqual(allParams.simulation, newParams.simulation)) {
      scenarioDispatch(setSimulationData({ data: newParams.simulation })) // prettier-ignore
    }
  }

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

  function handleClickToCompareButton() {}

  const containmentData = makeTimeSeries(
    scenarioState.simulation.data.simulationTimeRange.tMin,
    scenarioState.simulation.data.simulationTimeRange.tMax,
    scenarioState.containment.data.reduction,
  )

  async function handleSubmit(
    params: AllParams,
    { setSubmitting }: FormikHelpers<AllParams>,
  ) {
    const paramsFlat = {
      ...params.population,
      ...params.epidemiological,
      ...params.simulation,
    }

    // TODO: check the presence of the current counry
    // TODO: type cast the json into something
    const ageDistribution = countryAgeDistribution[params.population.country]
    const containmentData = makeTimeSeries(
      scenarioState.simulation.data.simulationTimeRange.tMin,
      scenarioState.simulation.data.simulationTimeRange.tMax,
      scenarioState.containment.data.reduction,
    )

    const newResult = await run(paramsFlat, severity, ageDistribution, containmentData) // prettier-ignore

    setResult(newResult)
    setSubmitting(false)
  }

  const overallScenarioOptions = stringsToOptions(scenarioState.overall.scenarios) // prettier-ignore
  const populationScenarioOptions = stringsToOptions(scenarioState.population.scenarios) // prettier-ignore
  const epidemiologicalScenarioOptions = stringsToOptions(scenarioState.epidemiological.scenarios) // prettier-ignore
  const containmentScenarioOptions = stringsToOptions(scenarioState.containment.scenarios) // prettier-ignore

  return (
    <Row noGutters>
      <Col md={12}>
        <Formik
          enableReinitialize
          initialValues={allParams}
          validationSchema={schema}
          onSubmit={handleSubmit}
          validate={setScenarioToCustom}
        >
          {({ errors, touched, isValid }) => {
            const canRun = isValid && severityTableIsValid(severity)

            return (
              <Form className="form">
                <Row noGutters>
                  <Col lg={4} xl={6} className="py-1 px-1">
                    <CardWithDropdown
                      id="overallScenario"
                      label={
                        <h3 className="p-0 m-0 text-truncate">Scenario</h3>
                      }
                      options={overallScenarioOptions}
                      value={overallScenarioOptions.find(s => s.label === scenarioState.overall.current)} // prettier-ignore
                      onValueChange={handleChangeOverallScenario}
                    >
                      <>
                        <Row noGutters>
                          <Col xl={6} className="py-1 px-1">
                            <CardWithDropdown
                              id="populationScenario"
                              label={
                                <h5 className="p-0 text-truncate">
                                  Population
                                </h5>
                              }
                              options={populationScenarioOptions}
                              value={populationScenarioOptions.find(s => s.label === scenarioState.population.current)} // prettier-ignore
                              onValueChange={handleChangePopulationScenario}
                            >
                              <FormSpinBox
                                id="population.populationServed"
                                label="Population"
                                step={1000}
                                errors={errors}
                                touched={touched}
                              />
                              <FormDropdown<string>
                                id="population.country"
                                label="Age Distribution"
                                options={countryOptions}
                              />
                              <FormSpinBox
                                id="population.suspectedCasesToday"
                                label="Initial suspected Cases"
                                step={1}
                                errors={errors}
                                touched={touched}
                              />
                              <FormSpinBox
                                id="population.importsPerDay"
                                label="Imports per Day"
                                step={0.1}
                                errors={errors}
                                touched={touched}
                              />
                              <FormDatePicker
                                id="simulation.simulationTimeRange"
                                label="Simulation time range"
                              />
                              <p>NOTE: Changing the time range will stretch the mitigation curve</p>
                            </CardWithDropdown>
                          </Col>

                          <Col xl={6} className="py-1 px-1">
                            <CardWithDropdown
                              id="epidemiologicalScenario"
                              label={
                                <h5 className="p-0 text-truncate">
                                  Epidemiology (speed/region)
                                </h5>
                              }
                              options={epidemiologicalScenarioOptions}
                              value={epidemiologicalScenarioOptions.find(s => s.label === scenarioState.epidemiological.current)} // prettier-ignore
                              onValueChange={
                                handleChangeEpidemiologicalScenario
                              }
                            >
                              <FormSpinBox
                                id="epidemiological.r0"
                                label="Annual average R0"
                                step={0.1}
                              />
                              <FormSpinBox
                                id="epidemiological.incubationTime"
                                label="Latency [days]"
                                step={1}
                                min={0}
                                errors={errors}
                                touched={touched}
                              />
                              <FormSpinBox
                                id="epidemiological.infectiousPeriod"
                                label="Infectious Period [days]"
                                step={1}
                                min={0}
                                errors={errors}
                                touched={touched}
                              />
                              <FormSpinBox
                                id="epidemiological.seasonalForcing"
                                label="Seasonal Forcing"
                                step={0.1}
                                min={0}
                                errors={errors}
                                touched={touched}
                              />
                              <FormDropdown<number>
                                id="epidemiological.peakMonth"
                                label="Seasonal Transmission Peak"
                                options={monthOptions}
                              />
                              <FormSpinBox
                                id="epidemiological.lengthHospitalStay"
                                label="Length of Hospital stay [days]"
                                step={1}
                                min={0}
                                errors={errors}
                                touched={touched}
                              />
                              <FormSpinBox
                                id="epidemiological.lengthICUStay"
                                label="Length of ICU stay [days]"
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
                              id="containmentScenario"
                              label={
                                <h5 className="p-0 text-truncate">
                                  Mitigation
                                </h5>
                              }
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
                                  Drag black dots with the mouse to simulate how
                                  infection control affects the outbreak
                                  trajectory. One is no infection control, zero
                                  is complete prevention of all transmission.
                                </p>
                              </div>
                            </CardWithDropdown>
                          </Col>
                        </Row>

                        <Row noGutters>
                          <Col className="py-1 px-1">
                            <CollapsibleCard
                              title={
                                <>
                                  <h5 className="my-1">Severity assumptions</h5>
                                  <p className="my-0">
                                    based on data from China
                                  </p>
                                </>
                              }
                              defaultCollapsed
                            >
                              <p>
                                This table summarizes the assumptions on
                                severity which are informed by epidemiological
                                and clinical observations in China. The first
                                column reflects our assumption on what fraction
                                of infections are reflected in the statistics
                                from China, the following columns contain the
                                assumption on what fraction of the previous
                                category deteriorates to the next. These fields
                                are editable and can be adjusted to different
                                assumptions. The last column is the implied
                                infection fatality for different age groups.
                              </p>
                              <SeverityTable
                                columns={columns}
                                rows={severity}
                                setRows={severity =>
                                  setSeverity(updateSeverityTable(severity))
                                }
                              />
                            </CollapsibleCard>
                          </Col>
                        </Row>
                      </>
                    </CardWithDropdown>
                  </Col>

                  <Col lg={8} xl={6} className="py-1 px-1">
                    <CollapsibleCard
                      title={<h3 className="p-0 m-0 text-truncate">Results</h3>}
                      defaultCollapsed={false}
                    >
                      <Row noGutters>
                        <Col>
                          <p>
                            {`This output of a mathematical model depends on model assumptions and parameter choices.
                                 We have done our best (in limited time) to check the model implementation is correct.
                                 Please carefully consider the parameters you choose and interpret the output with caution.`
                            }
                          </p>
                        </Col>
                      </Row>
                      <Row noGutters className="mb-4">
                        <Col>
                          <div>
                            <span className="">
                              <Button
                                className="run-button"
                                type="submit"
                                color="primary"
                                disabled={!canRun}
                              >
                                Run
                              </Button>
                            </span>
                            <span>
                              <Button
                                className="compare-button"
                                type="button"
                                color="success"
                                onClick={() =>
                                  hasResult && handleClickToCompareButton()
                                }
                              >
                                Compare
                              </Button>
                            </span>
                            <span>
                              <Button
                                className="export-button"
                                type="button"
                                color="secondary"
                                disabled={!canExport}
                                onClick={() =>
                                  canExport && result && exportResult(result)
                                }
                              >
                                Export
                              </Button>
                            </span>
                          </div>
                        </Col>
                      </Row>
                      <Row noGutters hidden={!result}>
                        <Col>
                          <FormSwitch
                            id="logScale"
                            label="Log scale"
                            checked={logScale}
                            onValueChanged={setLogScale}
                          />
                        </Col>
                      </Row>
                      <Row noGutters>
                        <Col>
                          <DeterministicLinePlot
                            data={result}
                            logScale={logScale}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <AgePlot data={result} rates={severity} />
                        </Col>
                      </Row>
                      <Row>
                        <PopTable result={result} rates={severity} />
                      </Row>
                    </CollapsibleCard>
                  </Col>
                </Row>
              </Form>
            )
          }}
        </Formik>
      </Col>
    </Row>
  )
}

export default Main
