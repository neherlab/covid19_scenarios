import React from 'react'

import { Field } from 'formik'
import { FormGroup, Col, Row } from 'reactstrap'

export interface FormInputProps {
  id: string
  label: string
}

export default function FormInput({ id, label }: FormInputProps) {
  return (
    <FormGroup className="my-0">
      <Row noGutters>
        <Col xl={7}>
          <label htmlFor={id}>{label}</label>
        </Col>
        <Col xl={5}>
          <Field className="form-control" id={id} name={id} />
        </Col>
      </Row>
    </FormGroup>
  )
}
