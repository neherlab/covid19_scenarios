import React from 'react'
import { Field } from 'formik'
import { Col, FormGroup, Row } from 'reactstrap'
import FormLabel from './FormLabel'

export interface FormCustomProps {
  children: React.ReactNode
  identifier: string
  label: string
  help?: string | React.ReactNode
}

export function FormCustom({ identifier, label, help, children }: FormCustomProps) {
  return (
    <Field>
      {() => (
        <FormGroup className="my-0">
          <Row noGutters>
            <Col xl={7}>
              <FormLabel identifier={identifier} label={label} help={help} />
            </Col>
            <Col xl={5}>{children}</Col>
          </Row>
        </FormGroup>
      )}
    </Field>
  )
}
