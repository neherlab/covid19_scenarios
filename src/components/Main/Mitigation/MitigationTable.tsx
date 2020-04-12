import React from 'react'

import _ from 'lodash'

import ReactResizeDetector from 'react-resize-detector'
import { FastField, FieldArray, FieldArrayRenderProps, FormikErrors, FormikTouched, FormikValues } from 'formik'
import { useTranslation } from 'react-i18next'
import { Button, FormGroup } from 'reactstrap'

import { FaTrash, FaPlus } from 'react-icons/fa'

import { MitigationInterval, MitigationIntervals } from '../../../algorithms/types/Param.types'

import { suggestNextMitigationInterval } from '../../../algorithms/utils/createMitigationInterval'

import { MitigationDatePicker } from './MitigationDatePicker'

import './MitigationTable.scss'

export interface MitigationTableProps {
  mitigationIntervals: MitigationIntervals
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

export interface GetErrorParams {
  identifier: string
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

export function getFormikError({ identifier, errors, touched }: GetErrorParams): string | undefined {
  const isTouched = _.get(touched, identifier)
  const errorMessage = _.get(errors, identifier)
  const showError = errorMessage && isTouched
  return showError ? (errorMessage as string) : undefined
}

export function MitigationTable({ mitigationIntervals, errors, touched }: MitigationTableProps) {
  const { t } = useTranslation()

  return (
    <ReactResizeDetector handleWidth>
      {({ width }: { width?: number }) => (
        <FieldArray
          name="containment.mitigationIntervals"
          render={(arrayHelpers) => (
            <div className="mitigation-table">
              <p>
                The presets for the mitigation and infections control measure below are currently just place holders. We
                are gathering this information at the moment. For the time being please adjust, add, and remove to match
                your community.
              </p>
              <p>Each measure consists of name, start/end date, and an effectiveness in %.</p>
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
                      errors={errors}
                      touched={touched}
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
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

function MitigationIntervalComponent({
  width,
  index,
  interval,
  arrayHelpers,
  errors,
  touched,
}: MitigationIntervalProps) {
  const { t } = useTranslation()

  const nameError = getFormikError({
    errors,
    touched,
    identifier: `containment.mitigationIntervals[${index}].name`,
  })

  const valueError = getFormikError({
    errors,
    touched,
    identifier: `containment.mitigationIntervals[${index}].mitigationValue`,
  })

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
            className={`name form-control ${nameError ? 'border-danger' : ''}`}
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
              className={`form-control item-value ${valueError ? 'border-danger' : ''}`}
              id={`containment.mitigationIntervals[${index}].mitigationValue`}
              name={`containment.mitigationIntervals[${index}].mitigationValue`}
              type="number"
            />
          </div>
        </div>
        <div className="item-controls">
          <Button type="button" onClick={() => arrayHelpers.remove(index)}>
            <FaTrash />
          </Button>
        </div>
      </div>
      <div className="w-100">
        {nameError && <p className="my-0 text-right text-danger">{`${t('Intervention name')}: ${nameError}`}</p>}
        {valueError && <p className="my-0 text-right text-danger">{`${t('Mitigation strength')}: ${valueError}`}</p>}
      </div>
    </FormGroup>
  )
}
