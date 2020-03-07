import React, { useState } from 'react'

import { Form, Formik, FormikHelpers } from 'formik'

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Row,
} from 'reactstrap'

import * as yup from 'yup'
import moment from 'moment'

import SeverityTable, {
  SeverityTableColumn,
  SeverityTableRow,
  SeverityTableRowErrors,
} from './SeverityTable'

import { CollapsibleCard } from './CollapsibleCard'
import { DeterministicLinePlot, StochasticLinePlot } from './Plot'
import AgePlot from './PlotAgeAndParams'
import PopTable from './PopAvgRates'
import ContainControl from './Containment'

import run from '../../algorithms/run'
import { exportResult } from '../../algorithms/exportResult'

import {
  AdditionalParams,
  AllParams,
  MainParams,
} from '../../algorithms/Param.types'

import countryAgeDistribution from '../../assets/data/country_age_distribution.json'
import severityData from '../../assets/data/severityData.json'
import containmentScenarios from '../../assets/data/containmentScenarios.json'
import epidemiologicalScenarios from '../../assets/data/epidemiologicalScenarios.json'
import defaultScenario from '../../assets/data/defaultScenario.json'
import { CountryAgeDistribution } from '../../assets/data/CountryAgeDistribution.types'
import { AlgorithmResult } from '../../algorithms/Result.types'
import FormInput from './FormInput'
import FormDropdown from './FormDropdown'
import FormSpinBox from './FormSpinBox'
import FormSwitch from './FormSwitch'
import _ from 'lodash'
import { ValidationError } from 'yup'
import FormDatePicker from './FormDatePicker'

import './Main.scss'

const mainParams: MainParams = {
  populationServed: { name: 'Population Served', defaultValue: 100_000 },
  ageDistribution: { name: 'Age Distribution', defaultValue: 'Switzerland' },
  suspectedCasesToday: { name: 'Suspected Cases Today', defaultValue: 10 },
  importsPerDay: { name: 'Imports Per Day', defaultValue: 2 },
  tMin: { name: 'Simulate from', defaultValue: moment().toDate() },
  tMax: { name: 'Simulate until', defaultValue: moment().add(1, 'year').toDate() } // prettier-ignore
}

const epiDefaults = epidemiologicalScenarios[defaultScenario.epidemiological];
const containmentDefault = containmentScenarios[defaultScenario.containment];

const additionalParams: AdditionalParams = {
  r0: { name: 'R0', defaultValue: epiDefaults.R0 },
  incubationTime: { name: 'Incubation Time [days]', defaultValue: epiDefaults.incubationTime },
  infectiousPeriod: { name: 'Infectious Period [days]', defaultValue: epiDefaults.infectiousPeriod },
  lengthHospitalStay: {
    name: 'Length of Hospital stay [days]',
    defaultValue: epiDefaults.lengthHospitalStay,
  },
  seasonalForcing: { name: 'Seasonal Forcing', defaultValue: epiDefaults.seasonalForcing },
  peakMonth: { name: 'Peak Transmission', defaultValue:  epiDefaults.peakMonth },
  numberStochasticRuns: { name: 'Number of stochastic runs', defaultValue: 0 },
}

// Reduce default values into an object { key: defaultValue }
const allDefaults = Object.entries({
  ...mainParams,
  ...additionalParams,
}).reduce((result, [key, { defaultValue }]) => {
  return { ...result, [key]: defaultValue }
}, {}) as AllParams

const columns: SeverityTableColumn[] = [
  { name: 'ageGroup', title: 'Age group' },
  { name: 'confirmed', title: 'Confirmed\n% total' },
  { name: 'severe', title: 'Severe\n% of confirmed' },
  { name: 'critical', title: 'Critical\n% of severe' },
  { name: 'fatal', title: 'Fatal\n% of critical' },
  { name: 'totalFatal', title: 'Fatal\n% of total' },
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
    const validationError = valError as ValidationError
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
    const { value: confirmed, errors: confirmedErrors } = validatePercentage(row.confirmed) // prettier-ignore
    const { value: severe, errors: severeErrors } = validatePercentage(row.severe) // prettier-ignore
    const { value: critical, errors: criticalErrors } = validatePercentage(row.critical) // prettier-ignore
    const { value: fatal, errors: fatalErrors } = validatePercentage(row.fatal) // prettier-ignore

    const totalFatal = confirmed * severe * critical * fatal * 1e-6

    const errors = {
      confirmed: confirmedErrors,
      severe: severeErrors,
      critical: criticalErrors,
      fatal: fatalErrors,
    }

    return {
      ...row,
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

const countries = Object.keys(countryAgeDistribution)
const countryOptions = countries.map(country => ({
  value: country,
  label: country,
}))

const defaultCountry = mainParams.ageDistribution.defaultValue
const defaultCountryOption = countryOptions.find(
  option => option.value === defaultCountry,
)

const months = moment.months()
const monthOptions = months.map((month, i) => ({
  value: i,
  label: month,
}))

const defaultMonth = additionalParams.peakMonth.defaultValue
const defaultMonthOption = monthOptions.find(
  option => option.value === defaultMonth,
)

const schema = yup.object().shape({
  ageDistribution: yup
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

var d3Ptr = [];

function Main() {
  const [severity, setSeverity] = useState<SeverityTableRow[]>(severityDefaults)
  const [result, setResult] = useState<AlgorithmResult | undefined>()
  const [country, setCountry] = useState<string>(defaultCountry)
  const [logScale, setLogScale] = useState<boolean>(true)
  const [tMin, setTMin] = useState<Date>(mainParams.tMin.defaultValue)
  const [tMax, setTMax] = useState<Date>(mainParams.tMax.defaultValue)
  const [peakMonth, setPeakMonth] = useState<number>(defaultMonth)

  const canExport = Boolean(result?.deterministicTrajectory)

  async function handleSubmit(
    params: AllParams,
    { setSubmitting }: FormikHelpers<AllParams>,
  ) {
    // TODO: check the presence of the current counry
    // TODO: type cast the json into something
    const ageDistribution = countryAgeDistribution[country]
    const newResult = await run(
      { ...params, tMin, tMax, country, ageDistribution: country, peakMonth },
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
        <Formik
          initialValues={allDefaults}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isValid }) => {
            return (
              <Form className="form">
                <Row noGutters>
                  <Col lg={4} xl={6}>
                    <Row noGutters>
                      <Col xl={6}>
                        <CollapsibleCard
                          title="Main parameters"
                          defaultCollapsed={false}
                        >
                          <FormSpinBox
                            key="populationServed"
                            id="populationServed"
                            label="Population Served"
                            step={1000}
                            errors={errors}
                            touched={touched}
                          />
                          <FormDropdown
                            key="country"
                            id="country"
                            label="Age Distribution"
                            options={countryOptions}
                            defaultOption={defaultCountryOption}
                            onValueChange={setCountry}
                          />
                          <FormSpinBox
                            key="suspectedCasesToday"
                            id="suspectedCasesToday"
                            label="Initial suspected Cases"
                            step={1}
                            errors={errors}
                            touched={touched}
                          />
                          <FormSpinBox
                            key="importsPerDay"
                            id="importsPerDay"
                            label="Imports Per Day"
                            step={0.1}
                            errors={errors}
                            touched={touched}
                          />
                          <FormDatePicker
                            key="simulationTimeRange"
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
                          title="Additional parameters"
                          defaultCollapsed={false}
                        >
                          <FormSpinBox key="r0" id="r0" label="R0" step={0.1} />
                          <FormSpinBox
                            key="incubationTime"
                            id="incubationTime"
                            label="Incubation Time [days]"
                            step={1}
                            min={0}
                            errors={errors}
                            touched={touched}
                          />
                          <FormSpinBox
                            key="infectiousPeriod"
                            id="infectiousPeriod"
                            label="Infectious Period [days]"
                            step={1}
                            min={0}
                            errors={errors}
                            touched={touched}
                          />
                          <FormSpinBox
                            key="lengthHospitalStay"
                            id="lengthHospitalStay"
                            label="Length of Hospital stay [days]"
                            step={1}
                            min={0}
                            errors={errors}
                            touched={touched}
                          />
                          <FormSpinBox
                            key="seasonalForcing"
                            id="seasonalForcing"
                            label="Seasonal Forcing"
                            step={0.1}
                            min={0}
                            errors={errors}
                            touched={touched}
                          />
                          <FormDropdown
                            key="peakMonth"
                            id="peakMonth"
                            label="Peak Month"
                            options={monthOptions}
                            defaultOption={defaultMonthOption}
                            onValueChange={setPeakMonth}
                          />
                          <FormSpinBox
                            key="numberStochasticRuns"
                            id="numberStochasticRuns"
                            label="Stochastic Runs"
                            step={1}
                            errors={errors}
                            touched={touched}
                          />
                        </CollapsibleCard>
                      </Col>
                    </Row>

                    <Row noGutters>
                      <Col>
                        <CollapsibleCard
                          title="Reduction in Transmission"
                          defaultCollapsed={true}
                        >
                          <p>Drag black dots with the mouse to simulate how infection
                             control affects the outbreak trajectory. Zero is no infection control,
                             one is complete prevention of all infections.
                          </p>
                          <ContainControl
                            data={d3Ptr}
                            initialData={containmentDefault.reduction}
                            minTime={tMin}
                            maxTime={tMax}
                          />
                        </CollapsibleCard>
                      </Col>
                    </Row>

                    <Row noGutters>
                      <Col>
                        <CollapsibleCard
                          title="Severity assumptions based on data from China"
                          defaultCollapsed={false}
                        >
                          <p>This table summarizes the assumptions on severity which are informed
                             by epidemiological and clinical observations in China. The first column
                             reflects our assumption on what fraction of infections are reflected
                             in the statistics from China, the following columns contain the assumption
                             on what fraction of the previous category deteriorates to the next.
                             These fields are editable and can be adjusted to different assumptions.
                             The last column is the implied infection fatality for different age groups.
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
                        <Col>
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
                          </FormGroup>
                        </Col>
                        <Col>
                          <FormSwitch
                            id="logScale"
                            label="Log scale"
                            checked={logScale}
                            onChange={checked => setLogScale(checked)}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <DeterministicLinePlot
                            data={result}
                            logScale={logScale}
                          />
                        </Col>
                        <Col>
                          <StochasticLinePlot
                            data={result}
                            logScale={logScale}
                          />
                        </Col>
                        <Col>
                          <PopTable result={result} rates={severity} />
                        </Col>
                        <Col>
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
