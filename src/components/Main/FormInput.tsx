import React from 'react'

import { Field } from 'formik'
import { Col, FormGroup, Row } from 'reactstrap'

export interface FormInputProps {
  identifier: string
  label: string
}

export default function FormInput({ identifier, label }: FormInputProps) {
  return (
    <FormGroup className="my-0">
      <Row noGutters>
        <Col xl={7}>
          <label htmlFor={identifier}>{label}</label>
        </Col>
        <Col xl={5}>
          <Field className="form-control" id={identifier} name={identifier} />
        </Col>
      </Row>
    </FormGroup>
  )
}
