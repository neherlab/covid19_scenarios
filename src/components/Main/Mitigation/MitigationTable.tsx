import React from 'react'
import ReactResizeDetector from 'react-resize-detector'

import { FastField, FieldArray, FieldArrayRenderProps } from 'formik'
import { useTranslation } from 'react-i18next'
import { Button, FormGroup } from 'reactstrap'

import { FaTrash, FaPlus } from 'react-icons/fa'

import { MitigationInterval, MitigationIntervals } from '../../../algorithms/types/Param.types'

import { suggestNextMitigationInterval } from '../../../algorithms/utils/createMitigationInterval'

import { MitigationDatePicker } from './MitigationDatePicker'

import './MitigationTable.scss'

export interface MitigationTableProps {
  mitigationIntervals: MitigationIntervals
}

export function MitigationTable({ mitigationIntervals }: MitigationTableProps) {
  const { t } = useTranslation()

  return (
    <ReactResizeDetector handleWidth>
      {({ width }: { width?: number }) => (
        <FieldArray
          name="containment.mitigationIntervals"
          render={(arrayHelpers) => (
            <div className="mitigation-table">
              <div className="w-100">
                {mitigationIntervals.map((interval: MitigationInterval, index: number) => {
                  if (!interval) {
                    return null
                  }
                  return (
                    <MitigationIntervalComponent
                      key={interval.id}
                      interval={interval}
                      index={index}
                      arrayHelpers={arrayHelpers}
                      width={width || 0}
                    />
                  )
                })}
              </div>
              <div className="table-controls">
                <Button
                  type="button"
                  onClick={() => {
                    const interval = suggestNextMitigationInterval(mitigationIntervals)
                    arrayHelpers.push(interval)
                  }}
                >
                  {t('Add')} <FaPlus />
                </Button>
              </div>
            </div>
          )}
        />
      )}
    </ReactResizeDetector>
  )
}

interface MitigationIntervalProps {
  width: number
  index: number
  interval: MitigationInterval
  arrayHelpers: FieldArrayRenderProps
}

function MitigationIntervalComponent({ width, index, interval, arrayHelpers }: MitigationIntervalProps) {
  const { t } = useTranslation()

  return (
    <FormGroup>
      <div
        className={`mitigation-interval ${
          // eslint-disable-next-line unicorn/no-nested-ternary
          width && width <= 325 ? 'very-narrow' : width && width <= 580 ? 'narrow' : 'wide'
        }`}
      >
        <div className="inputs">
          <FastField
            className="name form-control"
            id={`containment.mitigationIntervals[${index}].name`}
            name={`containment.mitigationIntervals[${index}].name`}
            type="text"
          />
          <div className="item-date-range-value-group">
            <MitigationDatePicker
              identifier={`containment.mitigationIntervals[${index}].timeRange`}
              value={interval.timeRange}
              allowPast
            />
            <FastField
              className="form-control item-value"
              id={`containment.mitigationIntervals[${index}].mitigationValue`}
              name={`containment.mitigationIntervals[${index}].mitigationValue`}
              type="number"
              step={0.1}
              min={0}
              max={1}
            />
          </div>
        </div>
        <div className="item-controls">
          <Button type="button" onClick={() => arrayHelpers.remove(index)}>
            {width && width > 430 && t('Remove')} <FaTrash />
          </Button>
        </div>
      </div>
    </FormGroup>
  )
}
