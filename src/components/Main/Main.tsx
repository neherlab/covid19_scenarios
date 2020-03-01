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

import run from '../../algorithms/run'

import {
  AdditionalParams,
  AllParams,
  MainParams,
  Month,
} from '../../algorithms/Param.types'

import countryAgeDistribution from '../../assets/data/country_age_distribution.json'
import { CountryAgeDistribution } from '../../assets/data/CountryAgeDistribution.types'

const mainParams: MainParams = {
  populationServed: { name: 'Population Served', defaultValue: 100_000 },
  ageDistribution: { name: 'Age Distribution', defaultValue: 'Switzerland' },
  suspectedCasesToday: { name: 'Suspected Cases Today', defaultValue: 10 },
  importsPerDay: { name: 'Imports Per Day', defaultValue: 2 },
}

const additionalParams: AdditionalParams = {
  r0: { name: 'R0', defaultValue: 2.2 },
  serialInterval: { name: 'Serial Interval', defaultValue: 8 },
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
  { name: 'mild', title: 'Mild [%]' },
  { name: 'severe', title: 'Severe [%]' },
  { name: 'critical', title: 'Critical [%]' },
  { name: 'fatal', title: 'Fatal [%]' },
]

const severityDefaults: SeverityTableRow[] = [
  { id: 0, ageGroup: 0,  mild: 99, severe: 1, critical: 0, fatal:  0},
  { id: 2, ageGroup: 10, mild: 97, severe: 2.4, critical: 0.4, fatal:  0.2,},
  { id: 4, ageGroup: 20, mild: 97, severe: 2.4, critical: 0.4, fatal:  0.2,},
  { id: 6, ageGroup: 30, mild: 97, severe: 2.4, critical: 0.4, fatal:  0.2,},
  { id: 8, ageGroup: 40, mild: 94, severe: 4.6, critical: 1, fatal:  0.4,},
  { id: 10, ageGroup: 50, mild: 90, severe: 6, critical: 2.7, fatal:  1.3,},
  { id: 12, ageGroup: 60, mild: 75, severe: 14, critical: 7.4, fatal:  3.6,},
  { id: 14, ageGroup: 70, mild: 50, severe: 30, critical: 12, fatal:  8.0,},
  { id: 16, ageGroup: 80, mild: 30, severe: 40, critical: 16, fatal:  14},
]


function Main() {
  const [severity, setSeverity] = useState<SeverityTableRow[]>(severityDefaults)

  async function handleSubmit(
    params: AllParams,
    { setSubmitting }: FormikHelpers<AllParams>,
  ) {
    const result = await run(params, severity, countryAgeDistribution)
    console.log(JSON.stringify({ result }, null, 2))
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
          </Form>
        </Formik>
      </Col>
    </Row>
  )
}

export default Main
