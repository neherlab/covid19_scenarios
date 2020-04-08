import React from 'react'

import _ from 'lodash'

import { Field, FieldProps, FormikTouched, FormikErrors } from 'formik'
import { Range, getTrackBackground } from 'react-range'
import HelpLabel from './HelpLabel'

export interface RangeSliderProps<T> {
  identifier: string
  label: string
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

  function validate(value: number[]) {
    let error
    if (value.length != 2) {
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
      {({ field: { value, onChange }, form: { setFieldValue } }: FieldProps<number[]>) => {
        const handleChange = (value: number[]) => {
          setFieldValue(identifier, value)
        }

        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              flexDirection: 'row',
              height: '40px',
            }}
          >
            <div id={identifier} style={{ width: '100%', justifyContent: 'left' }}>
              <HelpLabel identifier={identifier} label={label} help={help} />
            </div>

            <Range
              values={value}
              step={step}
              min={min}
              max={max}
              onChange={handleChange}
              renderTrack={({ props, children }) => (
                <div
                  onMouseDown={props.onMouseDown}
                  onTouchStart={props.onTouchStart}
                  style={{
                    ...props.style,
                    height: '24px',
                    display: 'flex',
                    width: '100%',
                  }}
                >
                  <div
                    ref={props.ref}
                    style={{
                      height: '8px',
                      width: '80%',
                      borderRadius: '4px',
                      background: getTrackBackground({
                        values: value,
                        colors: ['#ccc', 'mediumaquamarine', '#ccc'],
                        min: min,
                        max: max,
                      }),
                      alignSelf: 'center',
                    }}
                  >
                    {children}
                  </div>
                  <div style={{ width: '40%', paddingLeft: '20px', justifyContent: 'right' }}>
                    <output>
                      {value[0].toFixed(1)} - {value[1].toFixed(1)}
                    </output>
                  </div>
                </div>
              )}
              renderThumb={({ props, isDragged }) => (
                <div
                  style={{
                    ...props.style,
                    height: '17px',
                    width: '17px',
                    borderRadius: '4px',
                    backgroundColor: '#FFF',
                    borderWidth: '0px',
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
          </div>
        )
      }}
    </Field>
  )
}
