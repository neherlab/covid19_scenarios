import React, { useState } from 'react'

import { Field, Form, Formik, FormikHelpers } from 'formik'

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
import LinePlot from './Plot'
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

const mainParams: MainParams = {
  populationServed: { name: 'Population Served', defaultValue: 100_000 },
  ageDistribution: { name: 'Age Distribution', defaultValue: 'Switzerland' },
  suspectedCasesToday: { name: 'Suspected Cases Today', defaultValue: 10 },
  importsPerDay: { name: 'Imports Per Day', defaultValue: 2 },
  tMax: { name: 'Simulate until', defaultValue: "2021-03-31"}
}

const additionalParams: AdditionalParams = {
  r0: { name: 'R0', defaultValue: 2.2 },
  incubationTime: { name: 'Incubation Time [days]', defaultValue: 5 },
  infectiousPeriod: { name: 'Infectious Period [days]', defaultValue: 3 },
  lengthHospitalStay: { name: 'Length of Hospital stay [days]', defaultValue: 10 },
  seasonalForcing: { name: 'Seasonal Forcing', defaultValue: 0.2 },
  peakMonth: { name: 'Peak Month', defaultValue: Month.Jan },
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
  { name: 'severe', title: 'Severe [% of total]' },
  { name: 'fatal', title: 'Fatal [% of severe]' },
]

const severityDefaults: SeverityTableRow[] = [
  { id: 0, ageGroup: '0-9', confirmed: 100.0, severe: 1.0, fatal: 0.0 },
  { id: 2, ageGroup: '10-19', confirmed: 30.0, severe: 3.0, fatal: 0.7},
  { id: 4, ageGroup: '20-29', confirmed: 30.0, severe: 3.0, fatal: 0.7},
  { id: 6, ageGroup: '30-39', confirmed: 30.0, severe: 3.0, fatal: 0.7},
  { id: 8, ageGroup: '40-49', confirmed: 40.0, severe: 6.0, fatal: 0.7},
  { id: 10, ageGroup: '50-59', confirmed: 55.0, severe: 10.0, fatal: 13.0},
  { id: 12, ageGroup: '60-69', confirmed: 70.0, severe: 25.0, fatal: 14.4},
  { id: 14, ageGroup: '70-79', confirmed: 80.0, severe: 50.0, fatal: 16.0},
  { id: 16, ageGroup: '80+', confirmed: 90.0, severe: 70.0, fatal: 20.0},
]

function Main() {
  const [severity, setSeverity] = useState<SeverityTableRow[]>(severityDefaults)
  const [result, setResult] = useState<AlgorithmResult | undefined>()

  async function handleSubmit(
    params: AllParams,
    { setSubmitting }: FormikHelpers<AllParams>,
  ) {
    const newResult = await run(params, severity, countryAgeDistribution)
    setResult(newResult)
    // console.log(JSON.stringify({ result }, null, 2))
    setSubmitting(false)
  }

  return (
    <Row>
      <Col md={12}>
        <Formik initialValues={allDefaults} onSubmit={handleSubmit}>
          <Form className="form">
            <Card>
              <CardHeader>Main parameters</CardHeader>
              <CardBody>
                {Object.entries(mainParams).map(([key, { name }]) => (
                  <FormGroup key={key}>
                    <label htmlFor={key}>{name}</label>
                    <Field className="form-control" id={key} name={key} />
                  </FormGroup>
                ))}
              </CardBody>
            </Card>

            <CollapsibleCard title="Additional parameters">
              {Object.entries(additionalParams).map(([key, { name }]) => (
                <FormGroup key={key}>
                  <label htmlFor={key}>{name}</label>
                  <Field className="form-control" id={key} name={key} />
                </FormGroup>
              ))}
            </CollapsibleCard>

            <CollapsibleCard title="Severity">
              <SeverityTable
                columns={columns}
                rows={severity}
                setRows={setSeverity}
              />
            </CollapsibleCard>

            <FormGroup>
              <Button type="submit" color="primary">
                Run
              </Button>
            </FormGroup>

            <Card>
              <CardHeader>Results</CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <LinePlot data={result} />
                  </Col>
                  <Col>
                    <PopTable result={result} rates={severity}/>
                  </Col>
                  <Col>
                    <AgePlot data={result} rates={severity} />
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Form>
        </Formik>
      </Col>
    </Row>
  )
}

export default Main
