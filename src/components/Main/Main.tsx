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

import SeverityTable, {
  SeverityTableColumn,
  SeverityTableRow,
} from './SeverityTable'

import { CollapsibleCard } from './CollapsibleCard'
import { DeterministicLinePlot, StochasticLinePlot } from './Plot'
import AgePlot from './PlotAgeAndParams'
import PopTable from './PopAvgRates'

import run from '../../algorithms/run'

import {
  AdditionalParams,
  AllParams,
  MainParams,
  Month,
} from '../../algorithms/Param.types'

import countryAgeDistribution from '../../assets/data/country_age_distribution.json'
import { CountryAgeDistribution } from '../../assets/data/CountryAgeDistribution.types'
import { AlgorithmResult } from '../../algorithms/Result.types'
import FormInput from './FormInput'
import FormDropdown from './FormDropdown'
import FormSpinBox from './FormSpinBox'
import FormSwitch from './FormSwitch'

const mainParams: MainParams = {
  populationServed: { name: 'Population Served', defaultValue: 100_000 },
  ageDistribution: { name: 'Age Distribution', defaultValue: 'Switzerland' },
  suspectedCasesToday: { name: 'Suspected Cases Today', defaultValue: 10 },
  importsPerDay: { name: 'Imports Per Day', defaultValue: 2 },
  tMax: { name: 'Simulate until', defaultValue: '2021-03-31' },
}

const additionalParams: AdditionalParams = {
  r0: { name: 'R0', defaultValue: 2.2 },
  incubationTime: { name: 'Incubation Time [days]', defaultValue: 5 },
  infectiousPeriod: { name: 'Infectious Period [days]', defaultValue: 3 },
  lengthHospitalStay: {
    name: 'Length of Hospital stay [days]',
    defaultValue: 10,
  },
  seasonalForcing: { name: 'Seasonal Forcing', defaultValue: 0.4 },
  peakMonth: { name: 'Peak Month', defaultValue: Month.Jan },
  numberStochasticRuns: { name: 'Number of stochastic runs', defaultValue: 10 },
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
  { name: 'fatal', title: 'Fatal\n% of severe' },
  { name: 'totalFatal', title: 'Fatal\n% of total' },
]

/**
 * Updates computable columns in severity table
 */
export function updateSeverityTable(severity: SeverityTableRow[]) {
  return severity.map(row => {
    const { confirmed, severe, fatal } = row
    const totalFatal = confirmed * severe * fatal * 1e-4
    return { ...row, totalFatal }
  })
}

const severityDefaults: SeverityTableRow[] = updateSeverityTable([
  { id: 0, ageGroup: '0-9', confirmed: 30.0, severe: 1.0, fatal: 0.0 },
  { id: 2, ageGroup: '10-19', confirmed: 30.0, severe: 3.0, fatal: 7 },
  { id: 4, ageGroup: '20-29', confirmed: 30.0, severe: 3.0, fatal: 7 },
  { id: 6, ageGroup: '30-39', confirmed: 30.0, severe: 3.0, fatal: 7 },
  { id: 8, ageGroup: '40-49', confirmed: 40.0, severe: 6.0, fatal: 7 },
  { id: 10, ageGroup: '50-59', confirmed: 55.0, severe: 10.0, fatal: 13.0 },
  { id: 12, ageGroup: '60-69', confirmed: 70.0, severe: 25.0, fatal: 14.4 },
  { id: 14, ageGroup: '70-79', confirmed: 80.0, severe: 35.0, fatal: 20.0 },
  { id: 16, ageGroup: '80+', confirmed: 90.0, severe: 50.0, fatal: 26.0 },
])

const countries = Object.keys(countryAgeDistribution)
const countryOptions = countries.map(country => ({
  value: country,
  label: country,
}))

const defaultCountry = mainParams.ageDistribution.defaultValue
const defaultCountryOption = countryOptions.find(
  option => option.value === defaultCountry,
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

  // numberStochasticRuns: yup.number().required('Required'),

  // tMax: yup.string().required('Required'),
})

function Main() {
  const [severity, setSeverity] = useState<SeverityTableRow[]>(severityDefaults)
  const [result, setResult] = useState<AlgorithmResult | undefined>()
  const [country, setCountry] = useState<string>(defaultCountry)
  const [logScale, setLogScale] = useState<boolean>(true)

  async function handleSubmit(
    params: AllParams,
    { setSubmitting }: FormikHelpers<AllParams>,
  ) {
    // TODO: check the presence of the current counry
    // TODO: type cast the json into something
    const ageDistribution = countryAgeDistribution[country]
    const newResult = await run(
      { ...params, country },
      severity,
      ageDistribution,
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
          {({ errors, touched }) => {
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
                            onChange={country => setCountry(country)}
                          />
                          <FormSpinBox
                            key="suspectedCasesToday"
                            id="suspectedCasesToday"
                            label="Suspected Cases Today"
                            step={1}
                            errors={errors}
                            touched={touched}
                          />
                          <FormSpinBox
                            key="importsPerDay"
                            id="importsPerDay"
                            label="Imports Per Day"
                            step={1}
                            errors={errors}
                            touched={touched}
                          />
                          <FormInput
                            key="tMax"
                            id="tMax"
                            label="Simulate until"
                          />
                        </CollapsibleCard>

                        <CollapsibleCard title="Additional parameters">
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
                          <FormInput
                            key="peakMonth"
                            id="peakMonth"
                            label="Peak Month"
                          />
                        </CollapsibleCard>
                      </Col>

                      <Col xl={6}>
                        <CollapsibleCard
                          title="Severity"
                          defaultCollapsed={false}
                        >
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

                    <FormGroup>
                      <Button type="submit" color="primary">
                        Run
                      </Button>
                    </FormGroup>
                  </Col>

                  <Col lg={8} xl={6}>
                    <CollapsibleCard title="Results" defaultCollapsed={false}>
                      <Row>
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
