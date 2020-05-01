import React from 'react'

import { InputGroup } from 'reactstrap'

import { SpinBox } from './SpinBox'

export interface RangeSpinBoxProps<T> extends React.HTMLProps<HTMLInputElement> {
  identifier: string
  step?: number | string
  min?: number
  max?: number
  pattern?: string
}

export function RangeSpinBox<T>({
  identifier,
  step,
  min,
  max,
  pattern,
  className,
  ...restProps
}: RangeSpinBoxProps<T>) {
  return (
    <InputGroup>
      <SpinBox
        className={`form-control d-inline ${className}`}
        identifier={`${identifier}[0]`}
        type="number"
        step={step}
        min={min}
        max={max}
        pattern={pattern}
        {...restProps}
      />
      <span className="h-100 pt-2 px-1 text-bold">{'-'}</span>
      <SpinBox
        className={`form-control d-inline ${className}`}
        identifier={`${identifier}[1]`}
        type="number"
        step={step}
        min={min}
        max={max}
        pattern={pattern}
        {...restProps}
      />
    </InputGroup>
  )
}
