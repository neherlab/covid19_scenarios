import React, { useReducer, useState } from 'react'

import _ from 'lodash'

import { Form, Formik, FormikHelpers } from 'formik'
import moment from 'moment'
import * as yup from 'yup'

import { Button, Col, FormGroup, Row } from 'reactstrap'

import { CollapsibleCard } from './CollapsibleCard'
import ContainControl from './Containment'
import { DeterministicLinePlot, StochasticLinePlot } from './Plot'
import AgePlot from './PlotAgeAndParams'
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
  setContainmentScenario,
  setEpidemiologicalData,
  setEpidemiologicalScenario,
  setOverallScenario,
  setPopulationData,
  setPopulationScenario,
} from './state/actions'
import { scenarioReducer } from './state/reducer'
import { defaultScenarioState } from './state/state'

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

// const d3Ptr = defaultScenarioState.containment.data.map(y => ({ y })) // prettier-ignore
const d3Ptr = []

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

const defaultCountry = defaultScenarioState.population.data.country
const defaultCountryOption = countryOptions.find(option => option.value === defaultCountry) // prettier-ignore

const defaultMonth = defaultScenarioState.epidemiological.data.peakMonth
const defaultMonthOption = monthOptions.find(option => option.value === defaultMonth) // prettier-ignore

const defaultTMax = defaultScenarioState.simulation.data.tMin
const defaultTMin = defaultScenarioState.simulation.data.tMax

function Main() {
  const [logScale, setLogScale] = useState<boolean>(true)
  const [result, setResult] = useState<AlgorithmResult | undefined>()
  const [scenarioState, scenarioDispatch] = useReducer(scenarioReducer, defaultScenarioState, /* initDefaultState */) // prettier-ignore

  // TODO: These pieces of state should be handled by Formik
  const [country, setCountry] = useState<string>(defaultCountry) // prettier-ignore
  const [tMin, setTMin] = useState<Date>(defaultTMin)
  const [tMax, setTMax] = useState<Date>(defaultTMax)
  const [peakMonth, setPeakMonth] = useState<number>(defaultMonth) // prettier-ignore

  // TODO: These piece of state should be handled by Formik maybe too?
  const [severity, setSeverity] = useState<SeverityTableRow[]>(severityDefaults)

  const allParams = {
    population: scenarioState.population.data,
    epidemiological: scenarioState.epidemiological.data,
    simulation: scenarioState.simulation.data,
  }

  const canExport = Boolean(result?.deterministicTrajectory)

  function setScenarioToCustom(newParams: AllParams) {
    // NOTE: deep object comparison!
    if (!_.isEqual(allParams.population, newParams.population)) {
      scenarioDispatch(setPopulationData({ data: newParams.population }))
    }
    // NOTE: deep object comparison!
    if (!_.isEqual(allParams.epidemiological, newParams.epidemiological)) {
      scenarioDispatch(setEpidemiologicalData({ data: newParams.epidemiological })) // prettier-ignore
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

  async function handleSubmit(
    params: AllParams,
    { setSubmitting }: FormikHelpers<AllParams>,
  ) {
    console.log({ params })

    // TODO: check the presence of the current counry
    // TODO: type cast the json into something
    const ageDistribution = countryAgeDistribution[country]
    const newResult = await run(
      { ...params, tMin, tMax, country, peakMonth },
      severity,
      ageDistribution,
      d3Ptr,
    )

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
        <FormDropdown<string>
          id="overallScenario"
          label="Oveall Scenario"
          options={overallScenarioOptions}
          value={overallScenarioOptions.find(s => s.label === scenarioState.overall.current)} // prettier-ignore
          onValueChange={handleChangeOverallScenario}
        />

        <FormDropdown<string>
          id="populationScenario"
          label="Population Scenario"
          options={populationScenarioOptions}
          value={populationScenarioOptions.find(s => s.label === scenarioState.population.current)} // prettier-ignore
          onValueChange={handleChangePopulationScenario}
        />

        <FormDropdown<string>
          id="epidemiologicalScenario"
          label="Epidemiological Scenario"
          options={epidemiologicalScenarioOptions}
          value={epidemiologicalScenarioOptions.find(s => s.label === scenarioState.epidemiological.current)} // prettier-ignore
          onValueChange={handleChangeEpidemiologicalScenario}
        />

        <FormDropdown<string>
          id="containmentScenario"
          label="Containment Scenario"
          options={containmentScenarioOptions}
          value={containmentScenarioOptions.find(s => s.label === scenarioState.containment.current)} // prettier-ignore
          onValueChange={handleChangeContainmentScenario}
        />

        <Formik
          enableReinitialize
          initialValues={allParams}
          validationSchema={schema}
          onSubmit={handleSubmit}
          validate={setScenarioToCustom}
        >
          {({ errors, touched, isValid }) => {
            return (
              <Form className="form">
                <Row noGutters>
                  <Col lg={4} xl={6}>
                    <Row noGutters>
                      <Col xl={6}>
                        <CollapsibleCard
                          title="Population parameters"
                          defaultCollapsed={false}
                        >
                          <FormSpinBox
                            id="population.populationServed"
                            label="Population Served"
                            step={1000}
                            errors={errors}
                            touched={touched}
                          />
                          <FormDropdown<string>
                            id="population.country"
                            label="Age Distribution"
                            options={countryOptions}
                            defaultOption={defaultCountryOption}
                            onValueChange={setCountry}
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
                            startDate={tMin}
                            endDate={tMax}
                            onStartDateChange={setTMin}
                            onEndDateChange={setTMax}
                            label="Simulation time range"
                          />
                        </CollapsibleCard>
                      </Col>

                      <Col xl={6}>
                        <CollapsibleCard
                          title="Baseline epidemiological parameters"
                          defaultCollapsed={false}
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
                            id="epidemiological.lengthHospitalStay"
                            label="Length of Hospital stay [days]"
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
                            defaultOption={defaultMonthOption}
                            onValueChange={setPeakMonth}
                          />
                        </CollapsibleCard>
                      </Col>
                    </Row>

                    <Row noGutters>
                      <Col>
                        <CollapsibleCard
                          title="Reduction in Transmission by Interventions"
                          defaultCollapsed={false}
                        >
                          <ContainControl
                            data={d3Ptr}
                            minTime={tMin}
                            maxTime={tMax}
                          />
                          <p>
                            Drag black dots with the mouse to simulate how
                            infection control affects the outbreak trajectory.
                            One is no infection control, zero is complete
                            prevention of all transmission.
                          </p>
                        </CollapsibleCard>
                      </Col>
                    </Row>

                    <Row noGutters>
                      <Col>
                        <CollapsibleCard
                          title="Severity assumptions based on data from China"
                          defaultCollapsed
                        >
                          <p>
                            This table summarizes the assumptions on severity
                            which are informed by epidemiological and clinical
                            observations in China. The first column reflects our
                            assumption on what fraction of infections are
                            reflected in the statistics from China, the
                            following columns contain the assumption on what
                            fraction of the previous category deteriorates to
                            the next. These fields are editable and can be
                            adjusted to different assumptions. The last column
                            is the implied infection fatality for different age
                            groups.
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
                  </Col>

                  <Col lg={8} xl={6}>
                    <CollapsibleCard title="Results" defaultCollapsed={false}>
                      <Row>
                        <Col lg={8}>
                          <p>
                            {`This output of a mathematical model depends on model assumptions and parameter choices.
                                 We have done our best (in limited time) to check the model implementation is correct.
                                 Please carefully consider the parameters you choose and interpret the output with caution.
                                 Click on legend items to show/hide curves.`}
                          </p>
                        </Col>
                        <Col lg={4}>
                          <FormGroup>
                            <Button
                              className="run-button"
                              type="submit"
                              color="primary"
                              disabled={
                                !isValid || !severityTableIsValid(severity)
                              }
                            >
                              Run
                            </Button>
                            <Button
                              className={`export-button ${canExport ? '' : 'd-none'}`} // prettier-ignore
                              type="submit"
                              color="secondary"
                              disabled={!canExport}
                              onClick={() => result && exportResult(result)}
                            >
                              Export
                            </Button>
                            <FormSwitch
                              id="logScale"
                              label="Log scale"
                              checked={logScale}
                              onChange={checked => setLogScale(checked)}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <DeterministicLinePlot
                            data={result}
                            logScale={logScale}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <StochasticLinePlot
                            data={result}
                            logScale={logScale}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={4}>
                          <PopTable result={result} rates={severity} />
                        </Col>
                        <Col lg={8}>
                          <AgePlot data={result} rates={severity} />
                        </Col>
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
