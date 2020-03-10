import React from 'react'

import { Field, FieldProps } from 'formik'
import FormDropdownStateless from './FormDropdownStateless'

export interface FormDropdownOption<ValueType extends string | number> {
  value: ValueType
  label: string
}

export interface FormDropdownProps<ValueType extends string | number> {
  id: string
  label: string
  options: FormDropdownOption<ValueType>[]
}

export default function FormDropdown<ValueType extends string | number>({
  id,
  label,
  options,
}: FormDropdownProps<ValueType>) {
  return (
    <Field name={id}>
      {({
        field: { value, onBlur },
        form: { setFieldValue },
      }: FieldProps<ValueType>) => {
        return (
          <FormDropdownStateless
            id={id}
            label={label}
            options={options}
            value={{value, label: options.find(o => o.value === value)?.label ?? '' }} // prettier-ignore
            onValueChange={value => {
              setFieldValue?.(id, value)
            }}
            onOptionChange={option => {
              setFieldValue?.(id, option.value)
            }}
            onBlur={onBlur}
          />
        )
      }}
    </Field>
  )
}
