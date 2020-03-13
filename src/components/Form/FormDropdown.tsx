import React from 'react'

import { Field, FieldProps, FormikErrors, FormikTouched } from 'formik'
import FormDropdownStateless from './FormDropdownStateless'

export interface FormDropdownOption<ValueType extends string | number> {
  value: ValueType
  label: string
}

export interface FormDropdownProps<ValueType extends string | number> {
  identifier: string
  label: string
  help?: string | React.ReactNode
  options: FormDropdownOption<ValueType>[]
  errors?: FormikErrors<any>
  touched?: FormikTouched<any>
}

export function FormDropdown<ValueType extends string | number>({
  identifier,
  label,
  help,
  options,
}: FormDropdownProps<ValueType>) {
  return (
    <Field name={identifier}>
      {({ field: { value, onBlur }, form: { setFieldValue } }: FieldProps<ValueType>) => {
        return (
          <FormDropdownStateless
            identifier={identifier}
            label={label}
            help={help}
            options={options}
            value={{ value, label: options.find(o => o.value === value)?.label ?? '' }}
            onValueChange={value => {
              setFieldValue?.(identifier, value)
            }}
            onOptionChange={option => {
              setFieldValue?.(identifier, option.value)
            }}
            onBlur={onBlur}
          />
        )
      }}
    </Field>
  )
}
