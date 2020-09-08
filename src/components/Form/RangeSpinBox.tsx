import React from 'react'

import { InputGroup } from 'reactstrap'

import { SpinBox } from './SpinBox'

export interface RangeSpinBoxProps {
  identifier: string
  step?: number | string
  min?: number
  max?: number
  pattern?: string
  hasError?: boolean
}

export function RangeSpinBox({ identifier, step, min, max, pattern, hasError }: RangeSpinBoxProps) {
  return (
    <InputGroup>
      <SpinBox identifier={`${identifier}.begin`} type="number" step={step} min={min} max={max} hasError={hasError} />
      <span className="h-100 pt-2 px-1 text-bold">{' - '}</span>
      <SpinBox identifier={`${identifier}.end`} type="number" step={step} min={min} max={max} hasError={hasError} />
    </InputGroup>
  )
}
