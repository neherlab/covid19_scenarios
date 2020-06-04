import React from 'react'
import { FastField, FieldArrayRenderProps, FormikErrors, FormikTouched, FormikValues } from 'formik'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import { FaTrash } from 'react-icons/fa'
import { Button } from 'reactstrap'
import { MitigationInterval } from '../../../algorithms/types/restricted/ScenarioDatum'
import { getFormikErrors } from '../../../helpers/getFormikErrors'
import { RangeSpinBox } from '../../Form/RangeSpinBox'
import { MitigationDatePicker } from './MitigationDatePicker'

export interface MitigationIntervalProps {
  index: number
  interval: MitigationInterval
  arrayHelpers: FieldArrayRenderProps
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

export function MitigationIntervalComponent({
  index,
  interval,
  arrayHelpers,
  errors,
  touched,
}: MitigationIntervalProps) {
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
            <label htmlFor={`mitigation-interval-${index}-btn-remove`}>{t('Remove')}</label>
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
