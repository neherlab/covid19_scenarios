import React from 'react'

import { connect } from 'react-redux'
import { FastField, useField } from 'formik'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { FaTrash } from 'react-icons/fa'
import { Button } from 'reactstrap'

import { MitigationInterval } from '../../../algorithms/types/restricted/ScenarioDatum'
import { getFormikErrors } from '../../../helpers/getFormikErrors'

import { State } from '../../../state/reducer'

import { RangeSpinBox } from '../../Form/RangeSpinBox'
import { MitigationDatePicker } from './MitigationDatePicker'

export interface MitigationIntervalProps {
  interval: MitigationInterval
  index: number
  onRemove(): void
}

const mapStateToProps = (state: State) => ({})

const mapDispatchToProps = {}

export const MitigationIntervalComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MitigationIntervalComponentDisconnected)

export function MitigationIntervalComponentDisconnected({ interval, index, onRemove }: MitigationIntervalProps) {
  const { t } = useTranslation()
  const [, { error: errors, touched }] = useField(`mitigation.mitigationIntervals[${index}]`)

  const errorMessages = [
    { friendlyName: t('Intervention name'), identifier: `name` },
    { friendlyName: t('Transmission reduction'), identifier: `transmissionReduction` },
    { friendlyName: t('Date range'), identifier: `timeRange` },
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
        <div key={content} className="my-0 text-right text-danger">
          {content}
        </div>
      )
    }),
  )

  const nameHasError = errorMessages.some(({ identifier }) => identifier === 'name')
  const transmissionReductionHasError = errorMessages.some(({ identifier }) => identifier === 'transmissionReduction')

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
            <label htmlFor={`mitigation.mitigationIntervals[${index}].transmissionReduction`}>
              {t(`Transmission reduction`)}
            </label>
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
            <label htmlFor={`mitigation-interval-${index}-btn-remove`}>{t('Remove')}</label>
          </div>

          <div>
            <Button
              className="mitigation-item-btn-remove"
              type="button"
              id={`mitigation-interval-${index}-btn-remove`}
              onClick={onRemove}
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
