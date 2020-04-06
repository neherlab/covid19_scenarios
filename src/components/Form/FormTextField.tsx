import React from 'react'

import { Field, FieldProps, FormikErrors, FormikTouched, FormikValues } from 'formik'
import { FormGroup, Row, Col } from 'reactstrap'
import FormLabel from './FormLabel'

export interface FormTextFieldProps<ValueType extends string | number> {
  identifier: string
  label: string
  help?: string | React.ReactNode
}

export function FormTextField({ identifier, label, help }: FormTextFieldProps<string>) {
  return (
    <Field name={identifier}>
      {({ field: { value, onBlur }, form: { setFieldValue } }: FieldProps<string>) => {
        return (
          <FormGroup className="my-0">
            <Row noGutters>
              <Col>
                <FormLabel identifier={identifier} label={label} help={help} />
              </Col>
              <Col>
                <input
                  id={identifier}
                  type="text"
                  value={value}
                  onChange={(value) => {
                    setFieldValue?.(identifier, value.target.value)
                  }}
                  onBlur={onBlur}
                />
              </Col>
            </Row>
          </FormGroup>
        )
      }}
    </Field>
  )
}
