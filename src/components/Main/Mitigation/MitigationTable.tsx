import React from 'react'

import { isEmpty } from 'lodash'

import { FastField, FieldArray, FieldArrayRenderProps, FormikErrors, FormikTouched, FormikValues } from 'formik'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { Button, Row, Col } from 'reactstrap'

import { FaTrash, FaPlus } from 'react-icons/fa'

import type { MitigationInterval } from '../../../algorithms/types/Param.types'
import { suggestNextMitigationInterval } from '../../../algorithms/utils/createMitigationInterval'

import type { State } from '../../../state/reducer'
import { selectMitigationIntervals } from '../../../state/scenario/scenario.selectors'

import { MitigationDatePicker } from './MitigationDatePicker'
import { RangeSpinBox } from '../../Form/RangeSpinBox'

import { getFormikErrors } from '../../../helpers/getFormikErrors'

import './MitigationTable.scss'

export interface MitigationTableProps {
  mitigationIntervals: MitigationInterval[]
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

const mapStateToProps = (state: State) => ({
  mitigationIntervals: selectMitigationIntervals(state),
})

const mapDispatchToProps = {}

export const MitigationTable = connect(mapStateToProps, mapDispatchToProps)(MitigationTableDisconnected)

export function MitigationTableDisconnected({ mitigationIntervals, errors, touched }: MitigationTableProps) {
  const { t } = useTranslation()

  return (
    <FieldArray
      name="mitigation.mitigationIntervals"
      render={(arrayHelpers) => (
        <>
          <Row>
            <Col>
              <div className="mitigation-table-wrapper">
                {mitigationIntervals.map((interval: MitigationInterval, index: number) => {
                  return (
                    <MitigationIntervalComponent
                      key={interval.id}
                      interval={interval}
                      index={index}
                      arrayHelpers={arrayHelpers}
                      errors={errors}
                      touched={touched}
                    />
                  )
                })}
              </div>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="table-controls text-right align-middle">
                <Button
                  type="button"
                  onClick={() => {
                    const interval = suggestNextMitigationInterval(mitigationIntervals)
                    arrayHelpers.push(interval)
                  }}
                >
                  <FaPlus size={20} />
                  <span className="ml-2 d-inline align-middle">{t(`Add`)}</span>
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}
    />
  )
}

export interface MitigationIntervalProps {
  index: number
  interval: MitigationInterval
  arrayHelpers: FieldArrayRenderProps
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

function MitigationIntervalComponent({ index, interval, arrayHelpers, errors, touched }: MitigationIntervalProps) {
  const { t } = useTranslation()

  const errorMessages = [
    { friendlyName: t('Intervention name'), identifier: `mitigation.mitigationIntervals[${index}].name` },
    {
      friendlyName: t('Transmission reduction'),
      identifier: `mitigation.mitigationIntervals[${index}].transmissionReduction`,
    },
  ]
    .map(({ friendlyName, identifier }) => {
      const errorMessages = getFormikErrors({ identifier, errors, touched })
      return { friendlyName, identifier, errorMessages }
    })
    .filter(({ errorMessages }) => !isEmpty(errorMessages))

  const errorComponents = errorMessages.map(({ friendlyName, errorMessages }) =>
    errorMessages.map((message) => {
      const content = `${friendlyName}: ${message}`
      return (
        <tr key={content}>
          <div key={content} className="my-0 text-right text-danger">
            {message}
          </div>
        </tr>
      )
    }),
  )

  const nameHasError = errorMessages.some(({ identifier }) => identifier.includes('.name'))
  const transmissionReductionHasError = errorMessages.some(({ identifier }) =>
    identifier.includes('.transmissionReduction'),
  )

  return (
    <div className="mitigation-item">
      <div className="mitigation-item-container">
        <div className="mitigation-item-datum mitigation-item-name-wrapper">
          <div>
            <label htmlFor={`mitigation.mitigationIntervals[${index}].name`}>{t(`Name`)}</label>
          </div>

          <div>
            <FastField
              className={`form-control ${nameHasError ? 'border-danger' : ''}`}
              id={`mitigation.mitigationIntervals[${index}].name`}
              name={`mitigation.mitigationIntervals[${index}].name`}
              type="text"
            />
          </div>
        </div>

        <div className="mitigation-item-datum mitigation-item-time-range-wrapper">
          <div>
            <label htmlFor={`mitigation.mitigationIntervals[${index}].timeRange`}>{t(`Date range`)}</label>
          </div>

          <div>
            <MitigationDatePicker
              identifier={`mitigation.mitigationIntervals[${index}].timeRange`}
              value={interval.timeRange}
              allowPast
            />
          </div>
        </div>

        <div className="mitigation-item-datum mitigation-item-efficiency-wrapper">
          <div>
            <label htmlFor={`mitigation.mitigationIntervals[${index}].transmissionReduction`}>{t(`Efficiency`)}</label>
          </div>

          <div>
            <RangeSpinBox
              identifier={`mitigation.mitigationIntervals[${index}].transmissionReduction`}
              step={0.1}
              min={0}
              max={100}
              hasError={transmissionReductionHasError}
            />
          </div>
        </div>

        <div className="mitigation-item-datum mitigation-item-controls">
          <div>
            <label htmlFor={`mitigation-interval-${index}-btn-remove`}>{'Remove'}</label>
          </div>

          <div>
            <Button
              className="mitigation-item-btn-remove"
              type="button"
              id={`mitigation-interval-${index}-btn-remove`}
              onClick={() => arrayHelpers.remove(index)}
            >
              <FaTrash size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div>{errorComponents}</div>
    </div>
  )
}
