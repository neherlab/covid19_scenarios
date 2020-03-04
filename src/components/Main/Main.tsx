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
  seasonalForcing: { name: 'Seasonal Forcing', defaultValue: 0.2 },
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
  { name: 'confirmed', title: 'Confirmed [% total]' },
  { name: 'severe', title: 'Severe [% of confirmed]' },
  { name: 'fatal', title: 'Fatal [% of severe]' },
]

const severityDefaults: SeverityTableRow[] = [
  { id: 0, ageGroup: '0-9', confirmed: 100.0, severe: 1.0, fatal: 0.0 },
  { id: 2, ageGroup: '10-19', confirmed: 30.0, severe: 3.0, fatal: 7 },
  { id: 4, ageGroup: '20-29', confirmed: 30.0, severe: 3.0, fatal: 7 },
  { id: 6, ageGroup: '30-39', confirmed: 30.0, severe: 3.0, fatal: 7 },
  { id: 8, ageGroup: '40-49', confirmed: 40.0, severe: 6.0, fatal: 7 },
  { id: 10, ageGroup: '50-59', confirmed: 55.0, severe: 10.0, fatal: 13.0 },
  { id: 12, ageGroup: '60-69', confirmed: 70.0, severe: 25.0, fatal: 14.4 },
  { id: 14, ageGroup: '70-79', confirmed: 80.0, severe: 50.0, fatal: 16.0 },
  { id: 16, ageGroup: '80+', confirmed: 90.0, severe: 70.0, fatal: 20.0 },
]

const countries = Object.keys(countryAgeDistribution)

const defaultCountry = 'Sweden'

function Main() {
  const [severity, setSeverity] = useState<SeverityTableRow[]>(severityDefaults)
  const [result, setResult] = useState<AlgorithmResult | undefined>()
  const [country, setCountry] = useState<string>(defaultCountry)

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
        <Formik initialValues={allDefaults} onSubmit={handleSubmit}>
          <Form className="form">
            <Row noGutters>
              <Col lg={4} xl={6}>
                <Row noGutters>
                  <Col xl={6}>
                    <CollapsibleCard
                      title="Main parameters"
                      defaultCollapsed={false}
                    >
                      <CardBody>
                        <FormSpinBox
                          key="populationServed"
                          id="populationServed"
                          label="Population Served"
                          step={1000}
                        />
                        <FormDropdown
                          key="country"
                          id="country"
                          label="Age Distribution"
                          values={countries}
                          defaultValue={defaultCountry}
                          onChange={country => setCountry(country)}
                        />
                        <FormSpinBox
                          key="suspectedCasesToday"
                          id="suspectedCasesToday"
                          label="Suspected Cases Today"
                          step={1}
                        />
                        <FormSpinBox
                          key="importsPerDay"
                          id="importsPerDay"
                          label="Imports Per Day"
                          step={1}
                        />
                        <FormInput
                          key="tMax"
                          id="tMax"
                          label="Simulate until"
                        />
                      </CardBody>
                    </CollapsibleCard>

                    <CollapsibleCard title="Additional parameters">
                      <FormSpinBox key="r0" id="r0" label="R0" step={0.1} />
                      <FormSpinBox
                        key="incubationTime"
                        id="incubationTime"
                        label="Incubation Time [days]"
                        step={1}
                        min={0}
                      />
                      <FormSpinBox
                        key="infectiousPeriod"
                        id="infectiousPeriod"
                        label="Infectious Period [days]"
                        step={1}
                        min={0}
                      />
                      <FormSpinBox
                        key="lengthHospitalStay"
                        id="lengthHospitalStay"
                        label="Length of Hospital stay [days]"
                        step={1}
                        min={0}
                      />
                      <FormSpinBox
                        key="seasonalForcing"
                        id="seasonalForcing"
                        label="Seasonal Forcing"
                        step={0.1}
                        min={0}
                      />
                      <FormInput
                        key="peakMonth"
                        id="peakMonth"
                        label="Peak Month"
                      />
                    </CollapsibleCard>
                  </Col>

                  <Col xl={6}>
                    <CollapsibleCard title="Severity" defaultCollapsed={false}>
                      <SeverityTable
                        columns={columns}
                        rows={severity}
                        setRows={setSeverity}
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
                  <CardBody>
                    <Row>
                      <Col>
                        <DeterministicLinePlot data={result} />
                      </Col>
                      <Col>
                        <StochasticLinePlot data={result} />
                      </Col>
                      <Col>
                        <PopTable result={result} rates={severity} />
                      </Col>
                      <Col>
                        <AgePlot data={result} rates={severity} />
                      </Col>
                    </Row>
                  </CardBody>
                </CollapsibleCard>
              </Col>
            </Row>

            <FormGroup>
              <Button type="button" color="secondary">
                Export
              </Button>
            </FormGroup>
          </Form>
        </Formik>
      </Col>
    </Row>
  )
}

export default Main
