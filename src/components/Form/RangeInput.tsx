import React, { useState, useEffect, useRef } from 'react'
import { Input } from 'reactstrap'

import './RangeInput.scss'

export type RangeInputValue = [number | string | undefined, number | undefined]

interface RangeInputProps {
  value?: RangeInputValue
  onChange?: (value: RangeInputValue) => void
  title?: string
  placeholder?: string
  hasError?: boolean
}

export default function RangeInput({ value, onChange: propagateChange, hasError, ...restOfProps }: RangeInputProps) {
  const [hintValue, setHintValue] = useState<string>('')
  const [displayValue, setDisplayValue] = useState<string>(valueToDisplay(value))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const input = inputRef.current
    if (input && input !== document.activeElement) {
      setDisplayValue(valueToDisplay(value))
    }
  }, [value])

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = displayToValue(event.currentTarget.value)

    setDisplayValue(event.currentTarget.value)

    if (propagateChange) {
      propagateChange(value)
    }

    if (value && value[0] !== undefined && value[1] !== undefined && value[0] === value[1]) {
      setHintValue(`${value[0]} to ...`)
    } else if (hintValue) {
      setHintValue('')
    }
  }

  const onFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (value && value[0] !== undefined && value[1] !== undefined && value[0] === value[1]) {
      setHintValue(`${value[0]} to ...`)
    }
  }

  const onBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setHintValue('')
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowRight' && hintValue.includes(' to ...')) {
      setDisplayValue(`${displayValue} to `)
      setHintValue('')
    }
  }

  return (
    <div className="range-input">
      <Input
        innerRef={inputRef}
        placeholder="Enter a number or range of numbers..."
        title="Enter a number or range of numbers. e.g. 29 or 29-31"
        invalid={hasError}
        value={displayValue}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        {...restOfProps}
      />
      <input readOnly tabIndex={-1} className="hint" value={hintValue} />
    </div>
  )
}

function valueToDisplay(value?: RangeInputValue): string {
  if (value !== undefined && value[0] !== undefined && value[1] !== undefined) {
    if (value[0] === value[1]) {
      return `${value[0]}`
    }
    return `${value[0]} to ${value[1]}`
  }
  if (value !== undefined && value[0] !== undefined) {
    return `${value[0]}`
  }
  return ''
}

function displayToValue(display: string): RangeInputValue {
  const pieces = display.split(/\s/)
  const floats = pieces.map((piece) => Number.parseFloat(piece)).filter((num: number) => !Number.isNaN(num))
  if (floats.length >= 2) {
    return [floats[0], floats[1]]
  }
  if (floats.length === 1) {
    return [floats[0], floats[0]]
  }

  return [display, undefined]
}
