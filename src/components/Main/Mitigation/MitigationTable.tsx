import React from 'react'

import ReactResizeDetector from 'react-resize-detector'
import { FastField, FieldArray, FieldArrayRenderProps, FormikErrors, FormikTouched, FormikValues } from 'formik'
import { useTranslation } from 'react-i18next'
import { Button, Table } from 'reactstrap'

import { FaTrash, FaPlus } from 'react-icons/fa'

import type { MitigationInterval } from '../../../algorithms/types/Param.types'
import { suggestNextMitigationInterval } from '../../../algorithms/utils/createMitigationInterval'

import { MitigationDatePicker } from './MitigationDatePicker'
import { RangeSpinBox } from '../../Form/RangeSpinBox'

import { getFormikError } from '../../../helpers/getFormikError'

import './MitigationTable.scss'

export interface MitigationTableProps {
  mitigationIntervals: MitigationInterval[]
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
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

              <Table>
                <thead>
                  <tr>
                    <th>{`Intervention name`}</th>
                    <th>{`Date range`}</th>
                    <th>{`Transmission reduction`}</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
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
                </tbody>
              </Table>
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

export interface MitigationIntervalProps {
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
    <>
      <tr>
        <td>
          <FastField
            className={`form-control ${nameError ? 'border-danger' : ''}`}
            id={`containment.mitigationIntervals[${index}].name`}
            name={`containment.mitigationIntervals[${index}].name`}
            type="text"
          />
        </td>
        <td>
          <MitigationDatePicker
            identifier={`containment.mitigationIntervals[${index}].timeRange`}
            value={interval.timeRange}
            allowPast
          />
        </td>
        <td>
          <RangeSpinBox
            identifier={`containment.mitigationIntervals[${index}].mitigationValue`}
            step={0.1}
            min={0}
            max={100}
          />
        </td>
        <td>
          <div className="item-controls">
            <Button type="button" onClick={() => arrayHelpers.remove(index)}>
              <FaTrash />
            </Button>
          </div>
        </td>
      </tr>

      <tr>
        <div className="w-100">
          {nameError && <p className="my-0 text-right text-danger">{`${t('Intervention name')}: ${nameError}`}</p>}
          {valueError && <p className="my-0 text-right text-danger">{`${t('Mitigation strength')}: ${valueError}`}</p>}
        </div>
      </tr>
    </>
  )
}
