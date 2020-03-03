import React from 'react'

import { Field } from 'formik'
import { FormGroup } from 'reactstrap'

export interface FormInputProps {
  id: string
  label: string
}

export default function FormInput({ id, label }: FormInputProps) {
  return (
    <FormGroup>
      <label htmlFor={id}>{label}</label>
      <Field className="form-control" id={id} name={id} />
    </FormGroup>
  )
}
