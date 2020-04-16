import React, { useState } from 'react'

import _ from 'lodash'

import { Field, FieldProps, FormikTouched, FormikErrors } from 'formik'
import { Range, getTrackBackground } from 'react-range'
import { Col, FormGroup, Row } from 'reactstrap'
import FormLabel from './FormLabel'

export interface BaseRangeSliderProps {
  value: [number, number]
  step: number
  min: number
  max: number
  exportInternalState: (value: number[]) => void
}

function BaseRangeSlider({ value, exportInternalState, step, min, max }: BaseRangeSliderProps) {
  const [state, setState] = useState<[number, number]>(value)
  const setInternalState = (value: number[]) => {
    setState([value[0], value[1]])
  }

  const onFinalChange = (value: number[]) => {
    setInternalState(value)
    exportInternalState(value)
  }

  return (
    <Row>
      <Col sm md lg={4} xl={7}>
        <Range
          values={state}
          step={step}
          min={min}
          max={max}
          onChange={setInternalState}
          onFinalChange={onFinalChange}
          renderTrack={({ props, children }) => (
            <div
              role="button"
              tabIndex={0}
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: '28px',
                display: 'flex',
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: '8px',
                  width: '100%',
                  borderRadius: '4px',
                  background: getTrackBackground({
                    values: state,
                    colors: ['#ccc', 'mediumaquamarine', '#ccc'],
                    min,
                    max,
                  }),
                  alignSelf: 'center',
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props, isDragged }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '17px',
                width: '12px',
                borderRadius: '4px',
                backgroundColor: '#FFF',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0px 2px 6px #AAA',
              }}
            >
              <div
                style={{
                  height: '10px',
                  width: '5px',
                  backgroundColor: isDragged ? 'mediumaquamarine' : '#CCC',
                }}
              />
            </div>
          )}
        />
      </Col>
      <Col>
        <output>
          {state[0].toFixed(1)} - {state[1].toFixed(1)}
        </output>
      </Col>
    </Row>
  )
}

interface LabeledRangeSliderProps {
  identifier: string
  label?: string
  help?: string | React.ReactNode
  value: [number, number]
  exportInternalState: (value: number[]) => void
  step: number
  min: number
  max: number
}

function LabeledRangeSlider({
  identifier,
  label,
  help,
  value,
  exportInternalState,
  step,
  min,
  max,
}: LabeledRangeSliderProps) {
  if (label !== undefined) {
    return (
      <>
        <Col xl={7}>
          <FormLabel identifier={identifier} label={label} help={help} />
        </Col>
        <Col xl={5}>
          <BaseRangeSlider
            value={[value[0], value[1]]}
            exportInternalState={exportInternalState}
            step={step}
            min={min}
            max={max}
          />
        </Col>
      </>
    )
  }
  return (
    <Col>
      <BaseRangeSlider
        value={[value[0], value[1]]}
        exportInternalState={exportInternalState}
        step={step}
        min={min}
        max={max}
      />
    </Col>
  )
}

export interface RangeSliderProps<T> {
  identifier: string
  label?: string
  help?: string | React.ReactNode
  step: number
  min: number
  max: number

  errors?: FormikErrors<T>
  touched?: FormikTouched<T>
}

export function RangeSlider<T>({ identifier, label, help, step, min, max, errors, touched }: RangeSliderProps<T>) {
  const isTouched = _.get(touched, identifier)
  const errorMessage = _.get(errors, identifier)
  const showError = errorMessage && isTouched
  const borderDanger = showError ? 'border-danger' : ''

  function validate(value?: number[]) {
    let error
    if (!value) {
      return error
    }

    if (value.length !== 2) {
      error = `The input length must be 2, found ${value.length}`
    }
    if (value[0] > value[1]) {
      error = `The lower bound ${value[0]} cannot be greater than than the upper bound ${value[1]}`
    }
    if (min && value[0] < min) {
      error = `The lower bound cannot be less than ${min}`
    } else if (max && value[1] > max) {
      error = `The upper bound cannot be greater than ${max}`
    }

    return error
  }

  return (
    <Field name={identifier} className={`form-control ${borderDanger}`} validate={validate}>
      {({ field: { value }, form: { setFieldValue } }: FieldProps<number[]>) => {
        const exportInternalState = (value: number[]) => {
          setFieldValue(identifier, value)
        }
        return (
          <FormGroup className="my-0">
            <Row noGutters>
              <LabeledRangeSlider
                identifier={identifier}
                label={label}
                help={help}
                value={[value[0], value[1]]}
                exportInternalState={exportInternalState}
                step={step}
                min={min}
                max={max}
              />
            </Row>
          </FormGroup>
        )
      }}
    </Field>
  )
}
