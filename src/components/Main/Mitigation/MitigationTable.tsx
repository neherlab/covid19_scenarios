import React from 'react'

import { isEmpty } from 'lodash'

import { FastField, FieldArray, FieldArrayRenderProps, FormikErrors, FormikTouched, FormikValues } from 'formik'
import { useTranslation } from 'react-i18next'
import { Button, Row, Col } from 'reactstrap'

import { FaTrash, FaPlus } from 'react-icons/fa'

import type { MitigationInterval } from '../../../algorithms/types/Param.types'
import { suggestNextMitigationInterval } from '../../../algorithms/utils/createMitigationInterval'

import { MitigationDatePicker } from './MitigationDatePicker'
import { RangeSpinBox } from '../../Form/RangeSpinBox'
import FormLabel from '../../Form/FormLabel'

import { getFormikErrors } from '../../../helpers/getFormikErrors'

import './MitigationTable.scss'

export interface MitigationTableProps {
  mitigationIntervals: MitigationInterval[]
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

export function MitigationTable({ mitigationIntervals, errors, touched }: MitigationTableProps) {
  const { t } = useTranslation()

  return (
    <FieldArray
      name="mitigation.mitigationIntervals"
      render={(arrayHelpers) => (
        <div className="mitigation-table">
          <p>
            The presets for the mitigation and infections control measure below are currently just place holders. We are
            gathering this information at the moment. For the time being please adjust, add, and remove to match your
            community.
          </p>
          <p>Each measure consists of name, start/end date, and an effectiveness in %.</p>

          <div>
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
        <div key={content} className="my-0 text-right text-danger">
          {message}
        </div>
      )
    }),
  )

  const nameHasError = errorMessages.some(({ identifier }) => identifier.includes('.name'))
  const transmissionReductionHasError = errorMessages.some(({ identifier }) =>
    identifier.includes('.transmissionReduction'),
  )

  return (
    <>
      <Row noGutters className="mb-2">
        <Col xs={12} sm={12} md={12} lg={12} xl={12} style={{ border: '1px solid black' }}>
          <Row noGutters className="pr-1 pr-sm-1 pr-md-1 pr-lg-1 pr-xl-1">
            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="p-1 align-self-center">
              <Row noGutters>
                <Col
                  xs={1}
                  sm={1}
                  md={1}
                  lg={1}
                  xl={1}
                  className="align-self-center"
                  style={{ minWidth: '2rem', maxWidth: '2rem' }}
                >
                  <FormLabel
                    identifier={`mitigation.mitigationIntervals[${index}].timeRange`}
                    label=""
                    help={t('Start and end date of the mitigation measure.')}
                  />
                </Col>
                <Col>
                  <MitigationDatePicker
                    identifier={`mitigation.mitigationIntervals[${index}].timeRange`}
                    value={interval.timeRange}
                    allowPast
                  />
                </Col>
                <Col className="pl-1 align-self-center">
                  <Button size="sm" className="float-right" onClick={() => arrayHelpers.remove(index)}>
                    <FaTrash />
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col xs={12} sm={12} md={5} lg={12} xl={12} className="p-1">
              <Row noGutters>
                <Col
                  xs={1}
                  sm={1}
                  md={1}
                  lg={1}
                  xl={1}
                  style={{ minWidth: '2rem', maxWidth: '2rem' }}
                  className="align-self-center"
                >
                  <FormLabel
                    identifier={`mitigation.mitigationIntervals[${index}].name`}
                    label=""
                    help={t('A descriptive name for the mitigation measure.')}
                  />
                </Col>
                <Col>
                  <FastField
                    className={`form-control ${nameHasError ? 'border-danger' : ''}`}
                    id={`mitigation.mitigationIntervals[${index}].name`}
                    name={`mitigation.mitigationIntervals[${index}].name`}
                    type="text"
                  />
                </Col>
              </Row>
            </Col>
            <Col className="p-1 align-self-center">
              <Row noGutters>
                <Col
                  xs={1}
                  sm={1}
                  md={1}
                  lg={1}
                  xl={1}
                  style={{ minWidth: '2rem', maxWidth: '2rem' }}
                  className="align-self-center"
                >
                  <FormLabel
                    identifier={`mitigation.mitigationIntervals[${index}].transmissionReduction`}
                    label=""
                    help={t('The % effectiveness of the mitigation measure.')}
                  />
                </Col>
                <Col>
                  <RangeSpinBox
                    identifier={`mitigation.mitigationIntervals[${index}].transmissionReduction`}
                    step={0.1}
                    min={0}
                    max={100}
                    hasError={transmissionReductionHasError}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>{errorComponents}</Row>
    </>
  )
}
