import React, { useState, useEffect } from 'react'

import _ from 'lodash'

import { Form, Formik, FormikHelpers, useFormikContext } from 'formik'
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

import {
  AllParams,
  EpidemiologicalParams,
  PopulationParams,
  SimulationParams,
} from '../../algorithms/Param.types'

import containmentScenarios from '../../assets/data/containmentScenarios.json'
import countryAgeDistribution from '../../assets/data/country_age_distribution.json'
import defaultScenarioData from '../../assets/data/defaultScenario.json'
import epidemiologicalScenarios from '../../assets/data/epidemiologicalScenarios.json'
import populations from '../../assets/data/populations.json'
import severityData from '../../assets/data/severityData.json'

import { AlgorithmResult } from '../../algorithms/Result.types'

import FormDatePicker from './FormDatePicker'
import FormDropdown from './FormDropdown'
import FormDropdownDense from './FormDropdownDense'
import FormSpinBox from './FormSpinBox'
import FormSwitch from './FormSwitch'

import './Main.scss'

const populationDefault = populations[defaultScenarioData.population]
const epiDefaults =
  epidemiologicalScenarios[defaultScenarioData.epidemiological]
const containmentDefault = containmentScenarios[defaultScenarioData.containment]

export function getPopulationParams(scenario: string): PopulationParams {
  console.log("pop", scenario);
  return {
    populationServed: populations[scenario].populationServed,
    country: populations[scenario].country,
    suspectedCasesToday: populations[scenario].suspectedCasesToday,
    importsPerDay: populations[scenario].importsPerDay,
  }
}

export function getSimulationParams(scenario: string): SimulationParams {
  return {
    tMin: moment().toDate(),
    tMax: moment().add(0.5, 'year').toDate(), // prettier-ignore
    numberStochasticRuns: 0,
  }
}

export function getEpidemiologicalParams(
  scenario: string,
): EpidemiologicalParams {
  console.log("epi",scenario);
  return {
    r0: epidemiologicalScenarios[scenario].params.R0,
    incubationTime: epidemiologicalScenarios[scenario].params.incubationTime,
    infectiousPeriod: epidemiologicalScenarios[scenario].params.infectiousPeriod,
    lengthHospitalStay: epidemiologicalScenarios[scenario].params.lengthHospitalStay,
    seasonalForcing: epidemiologicalScenarios[scenario].params.seasonalForcing,
    peakMonth: epidemiologicalScenarios[scenario].params.peakMonth,
  }
}

export function getAllParams(scenario: object): AllParams {
  console.log(scenario, scenario.epidemiological);
  return {
    ...getPopulationParams(scenario.population),
    ...getEpidemiologicalParams(scenario.epidemiological),
    ...getSimulationParams("default"),
  } as AllParams
}

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

const customScenarios = {'epidemiological':'custom', 'population':'custom', 'containment':'custom'};

// const DEFAULT_SCENARIO_NAME = 'default'
// const defaultScenario = DEFAULT_SCENARIO_NAME

// const scenarios = [DEFAULT_SCENARIO_NAME, CUSTOM_SCENARIO_NAME]
// const scenarioOptions = scenarios.map((scenario) => ({ value: scenario, label: scenario })) // prettier-ignore
// const defaultScenarioOption = scenarioOptions.find(option => option.value === defaultScenario) // prettier-ignore

const popScenarioOptions = Object.keys(populations).map((scenario) => ({ value: scenario, label: scenario })) // prettier-ignore
// popScenarioOptions.push({value:customScenarios.population, label:customScenarios.population});
const defaultPopScenarioOption = popScenarioOptions.find(option => option.value === defaultScenarioData.population) // prettier-ignore

const epiScenarioOptions = Object.keys(epidemiologicalScenarios).map((scenario) => ({ value: scenario, label: epidemiologicalScenarios[scenario].label })) // prettier-ignore
// epiScenarioOptions.push({value:customScenarios.epidemiological, label:customScenarios.epidemiological});
const defaultEpiScenarioOption = epiScenarioOptions.find(option => option.value === defaultScenarioData.epidemiological) // prettier-ignore

const conScenarioOptions = Object.keys(containmentScenarios).map((scenario) => ({ value: scenario, label: containmentScenarios[scenario].label })) // prettier-ignore
// conScenarioOptions.push({value:customScenarios.containment, label:customScenarios.containment});
const defaultConScenarioOption = conScenarioOptions.find(option => option.value === defaultScenarioData.containment) // prettier-ignore

const defaultParams: AllParams = getAllParams(defaultScenarioData)

const countries = Object.keys(countryAgeDistribution)
const countryOptions = countries.map(country => ({ value: country, label: country })) // prettier-ignore

const months = moment.months()
const monthOptions = months.map((month, i) => ({ value: i, label: month })) // prettier-ignore

const defaultCountry = defaultParams.country
const defaultCountryOption = countryOptions.find(option => option.value === defaultCountry) // prettier-ignore

const defaultMonth = defaultParams.peakMonth
const defaultMonthOption = monthOptions.find(option => option.value === defaultMonth) // prettier-ignore

const defaultTMin = defaultParams.tMin
const defaultTMax = defaultParams.tMax

const schema = yup.object().shape({
  country: yup
    .string()
    .required('Required')
    .oneOf(countries, 'No such country in our data'),

  importsPerDay: yup.number().required('Required'),

  incubationTime: yup
    .number()
    .required('Required')
    .min(0, 'Should be non-negative'),

  infectiousPeriod: yup
    .number()
    .required('Required')
    .min(0, 'Should be non-negative'),

  lengthHospitalStay: yup
    .number()
    .required('Required')
    .min(0, 'Should be non-negative'),

  populationServed: yup
    .number()
    .required('Required')
    .min(0, 'Should be non-negative'),

  r0: yup.number().required('Required'),

  seasonalForcing: yup.number().required('Required'),

  suspectedCasesToday: yup
    .number()
    .required('Required')
    .min(0, 'Should be non-negative'),

  // serialInterval: yup.number().required('Required'),

  numberStochasticRuns: yup
    .number()
    .required('Required')
    .min(0, 'Should be non-negative')
    .max(100, 'too many stochastic trajectories will slow things down'),

  // tMax: yup.string().required('Required'),
})

let d3Ptr = containmentDefault.reduction.map(y => {
  return { y }
})


export function setContainment(scenario: string) {
  console.log("con", scenario, containmentScenarios[scenario]);
  d3Ptr = containmentScenarios[scenario].reduction.map(y => { return { y }})
}


function Main() {
  const [severity, setSeverity] = useState<SeverityTableRow[]>(severityDefaults)
  const [result, setResult] = useState<AlgorithmResult | undefined>()
  const [country, setCountry] = useState<string>(defaultCountry)
  const [logScale, setLogScale] = useState<boolean>(true)
  const [tMin, setTMin] = useState<Date>(defaultTMin)
  const [tMax, setTMax] = useState<Date>(defaultTMax)
  const [peakMonth, setPeakMonth] = useState<number>(defaultMonth)
  // const [scenario, setScenario] = useState<string>(defaultScenario)
  const [epiScenario, setEpiScenario] = useState<string>(defaultScenarioData.epidemiological)
  const [popScenario, setPopScenario] = useState<string>(defaultScenarioData.population)
  const [conScenario, setConScenario] = useState<string>(defaultScenarioData.containment)

  const params = getAllParams({"epidemiological": epiScenario,
                               "population": popScenario,
                               "containment": conScenario})

  const canExport = Boolean(result?.deterministicTrajectory)

  function setScenarioToCustom(params: AllParams) {
    // HACK: we use Formik's validate for a side effect.
    // What is the better way to set the `scenario` field when form changes?
    setEpiScenario(customScenarios.epidemiological)
    setPopScenario(customScenarios.population)
    setConScenario(customScenarios.containment)
  }

  async function handleSubmit(
    params: AllParams,
    { setSubmitting }: FormikHelpers<AllParams>,
  ) {
    // TODO: check the presence of the current counry
    // TODO: type cast the json into something
    const ageDistribution = countryAgeDistribution[country]
    const newResult = await run(
      { ...params, tMin, tMax, country, peakMonth},
      severity,
      ageDistribution,
      d3Ptr,
    )

    setResult(newResult)
    setSubmitting(false)
  }

  return (
    <Row noGutters>
      <Col md={12}>
        <Row>
        <Col md={4}>
        <FormDropdownDense<string>
          id="popScenario"
          label="Population"
          options={popScenarioOptions}
          defaultOption={defaultPopScenarioOption}
          value={popScenarioOptions.find(s => s.label === popScenario)}
          onValueChange={setPopScenario}
        />
        </Col>
        <Col md={4}>
        <FormDropdownDense<string>
          id="epiScenario"
          label="Epidemiological preset"
          options={epiScenarioOptions}
          defaultOption={defaultEpiScenarioOption}
          value={epiScenarioOptions.find(s => s.label === epiScenario)}
          onValueChange={setEpiScenario}
        />
        </Col>
        <Col md={4}>
        <FormDropdownDense<string>
          id="conScenario"
          label="Infection control preset"
          options={conScenarioOptions}
          defaultOption={defaultConScenarioOption}
          value={conScenarioOptions.find(s => s.label === conScenario)}
          onValueChange={setContainment}
        />
        </Col>
        </Row>

        <Formik
          enableReinitialize
          initialValues={params}
          validationSchema={schema}
          onSubmit={handleSubmit}
          // validate={setScenarioToCustom}
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
                            id="populationServed"
                            label="Population Served"
                            step={1000}
                            errors={errors}
                            touched={touched}
                          />
                          <FormDropdown<string>
                            id="country"
                            label="Age Distribution"
                            options={countryOptions}
                            defaultOption={defaultCountryOption}
                            onValueChange={setCountry}
                          />
                          <FormSpinBox
                            id="suspectedCasesToday"
                            label="Initial suspected Cases"
                            step={1}
                            errors={errors}
                            touched={touched}
                          />
                          <FormSpinBox
                            id="importsPerDay"
                            label="Imports per Day"
                            step={0.1}
                            errors={errors}
                            touched={touched}
                          />
                          <FormDatePicker
                            id="simulationTimeRange"
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
                            id="r0"
                            label="Annual average R0"
                            step={0.1}
                          />
                          <FormSpinBox
                            id="incubationTime"
                            label="Latency [days]"
                            step={1}
                            min={0}
                            errors={errors}
                            touched={touched}
                          />
                          <FormSpinBox
                            id="infectiousPeriod"
                            label="Infectious Period [days]"
                            step={1}
                            min={0}
                            errors={errors}
                            touched={touched}
                          />
                          <FormSpinBox
                            id="lengthHospitalStay"
                            label="Length of Hospital stay [days]"
                            step={1}
                            min={0}
                            errors={errors}
                            touched={touched}
                          />
                          <FormSpinBox
                            id="seasonalForcing"
                            label="Seasonal Forcing"
                            step={0.1}
                            min={0}
                            errors={errors}
                            touched={touched}
                          />
                          <FormDropdown<number>
                            id="peakMonth"
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
