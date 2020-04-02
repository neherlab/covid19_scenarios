import React from 'react'
import { Range, getTrackBackground } from 'react-range'
import HelpLabel from './HelpLabel'

import { Tuple } from '../../algorithms/types/Param.types'

export interface RangeSliderProps {
  identifier: string
  label: string
  help?: string | React.ReactNode
  values: Tuple
  setValues(values: Tuple): void
  step: number
  min: number
  max: number
}

export function RangeSlider({ identifier, label, help, values, setValues, step, min, max }: RangeSliderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        height: '40px',
      }}
    >
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={(x) => setValues(x)}
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
            <div id={identifier} style={{ width: '50%', paddingRight: '20px' }}>
              <HelpLabel identifier={identifier} label={label} help={help} />
            </div>
            <div
              ref={props.ref}
              style={{
                height: '8px',
                width: '35%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values: values,
                  colors: ['#ccc', 'mediumaquamarine', '#ccc'],
                  min: min,
                  max: max,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>
            <div style={{ width: '20%', paddingLeft: '20px' }}>
              <output>
                {values[0].toFixed(1)} - {values[1].toFixed(1)}
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
}
