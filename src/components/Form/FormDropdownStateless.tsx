import React from 'react'

import Select, { ValueType as SelectValueType } from 'react-select'
import { Col, FormGroup, Row } from 'reactstrap'

import { FormDropdownOption } from './FormDropdownOption'
import FormLabel from './FormLabel'

export interface FormDropdownProps<ValueType extends string | number> {
  identifier: string
  label: string | React.ReactNode
  help?: string | React.ReactNode
  options: FormDropdownOption<ValueType>[]
  defaultOption?: FormDropdownOption<ValueType>
  value?: FormDropdownOption<ValueType>
  onValueChange?(value: ValueType): void
  onOptionChange?(option: FormDropdownOption<ValueType>): void
  onBlur?<T>(e: React.FocusEvent<T>): void
}

export default function FormDropdownStateless<ValueType extends string | number>({
  identifier,
  label,
  help,
  options,
  defaultOption,
  value,
  onValueChange,
  onOptionChange,
  onBlur,
}: FormDropdownProps<ValueType>) {
  return (
    <FormGroup className="my-0">
      <Row noGutters>
        <Col xl={7}>
          <FormLabel identifier={identifier} label={label} help={help} />
        </Col>
        <Col xl={5}>
          <Select
            id={identifier}
            name={identifier}
            options={options}
            defaultValue={defaultOption}
            value={value}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
            })}
            isMulti={false}
            onChange={(option: SelectValueType<FormDropdownOption<ValueType>>) => {
              // FIXME: This is currently cannot be expressed without type errors due to a defect in typings
              // See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/32553
              // See: https://github.com/JedWatson/react-select/issues/2902
              if (option) {
                const optionCasted = option as FormDropdownOption<ValueType>
                onValueChange?.(optionCasted.value)
                onOptionChange?.(optionCasted)
              }
            }}
            onBlur={onBlur}
          />
        </Col>
      </Row>
    </FormGroup>
  )
}
