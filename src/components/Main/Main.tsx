import React, { useState } from 'react'

import { Formik, Field, Form, FormikHelpers } from 'formik'

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Collapse,
  FormGroup,
  Row,
} from 'reactstrap'

import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa'

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

function Main() {
  const [collapsed, setCollapsed] = useState(false)
  const toggle = () => setCollapsed(!collapsed)

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

            <Card>
              <CardHeader>
                <Button type="button" color="default" onClick={toggle}>
                  <span style={{ marginRight: '5px' }}>
                    {collapsed ? <FaPlusCircle /> : <FaMinusCircle />}
                  </span>
                  <span>Additional parameters</span>
                </Button>
              </CardHeader>

              <Collapse isOpen={!collapsed}>
                <CardBody>
                  {Object.entries(paramNames).map(([key, name]) => (
                    <FormGroup key={key}>
                      <label htmlFor={key}>{name}</label>
                      <Field className="form-control" id={key} name={key} />
                    </FormGroup>
                  ))}
                </CardBody>
              </Collapse>
            </Card>

            <Button type="submit" color="primary">
              Run
            </Button>
          </Form>
        </Formik>
      </Col>
    </Row>
  )
}

export default Main
