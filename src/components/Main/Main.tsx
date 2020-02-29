import React from 'react'

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

interface MainFields {
  populationServed: number
  ageDistribution: string
  suspectedCasesToday: number
  importsPerDay: number
}

const mainFieldNames = {
  populationServed: 'Population Served',
  ageDistribution: 'Age Distribution',
  suspectedCasesToday: 'Suspected Cases Today',
  importsPerDay: 'Imports Per Day',
}

const mainFieldDefaults: MainFields = {
  populationServed: 100_000,
  ageDistribution: 'Switzerland',
  suspectedCasesToday: 10,
  importsPerDay: 2,
}

export enum Month {
  Jan = 'Jan',
  Feb = 'Feb',
  Mar = 'Mar',
  Apr = 'Apr',
  May = 'May',
  Jun = 'Jun',
  Jul = 'Jul',
  Aug = 'Aug',
  Sep = 'Sep',
  Oct = 'Oct',
  Nov = 'Nov',
  Dec = 'Dec',
}

interface Params {
  r0: number
  serialInterval: number
  seasonalForcing: number
  peakMonth: Month
}

const paramNames = {
  r0: 'R0',
  serialInterval: 'Serial Interval',
  seasonalForcing: 'Seasonal Forcing',
  peakMonth: 'Peak Month',
}

const paramDefaults: Params = {
  r0: 2.2,
  serialInterval: 8,
  seasonalForcing: 0.2,
  peakMonth: Month.Jan,
}

type AllFields = MainFields | Params

const allDefaults: AllFields = { ...mainFieldDefaults, ...paramDefaults }

const columns: SeverityTableColumn[] = [
  { name: 'ageGroup', title: 'Age group' },
  { name: 'mild', title: 'Mild' },
  { name: 'severe', title: 'Severe' },
  { name: 'critical', title: 'Critical' },
]

const initialData: SeverityTableRow[] = [
  { id: 0, ageGroup: 0, mild: 73, severe: 15, critical: 2 },
  { id: 1, ageGroup: 5, mild: 80, severe: 10, critical: 2 },
  { id: 2, ageGroup: 10, mild: 85, severe: 12, critical: 1 },
  { id: 3, ageGroup: 15, mild: 85, severe: 12, critical: 1 },
  { id: 4, ageGroup: 20, mild: 85, severe: 12, critical: 1 },
  { id: 5, ageGroup: 25, mild: 85, severe: 12, critical: 1 },
  { id: 6, ageGroup: 30, mild: 85, severe: 12, critical: 1 },
  { id: 7, ageGroup: 35, mild: 85, severe: 12, critical: 1 },
  { id: 8, ageGroup: 40, mild: 85, severe: 12, critical: 1 },
  { id: 9, ageGroup: 45, mild: 85, severe: 12, critical: 1 },
  { id: 10, ageGroup: 50, mild: 85, severe: 12, critical: 1 },
  { id: 11, ageGroup: 55, mild: 85, severe: 12, critical: 1 },
  { id: 12, ageGroup: 60, mild: 85, severe: 12, critical: 1 },
  { id: 13, ageGroup: 65, mild: 85, severe: 12, critical: 1 },
  { id: 14, ageGroup: 70, mild: 85, severe: 12, critical: 1 },
  { id: 15, ageGroup: 75, mild: 85, severe: 12, critical: 1 },
  { id: 16, ageGroup: 80, mild: 85, severe: 12, critical: 1 },
]

function Main() {
  function handleSubmit(
    values: AllFields,
    { setSubmitting }: FormikHelpers<AllFields>,
  ) {
    setTimeout(() => {
      console.log(JSON.stringify(values, null, 2))
      setSubmitting(false)
    }, 500)
  }

  return (
    <Row>
      <Col md={12}>
        <Formik initialValues={allDefaults} onSubmit={handleSubmit}>
          <Form className="form">
            <Card>
              <CardHeader>Main parameters</CardHeader>
              <CardBody>
                {Object.entries(mainFieldNames).map(([key, name]) => (
                  <FormGroup key={key}>
                    <label htmlFor={key}>{name}</label>
                    <Field className="form-control" id={key} name={key} />
                  </FormGroup>
                ))}
              </CardBody>
            </Card>

            <CollapsibleCard title="Additional parameters">
              {Object.entries(paramNames).map(([key, name]) => (
                <FormGroup key={key}>
                  <label htmlFor={key}>{name}</label>
                  <Field className="form-control" id={key} name={key} />
                </FormGroup>
              ))}
            </CollapsibleCard>

            <CollapsibleCard title="Severity">
              <SeverityTable columns={columns} initialData={initialData} />
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
