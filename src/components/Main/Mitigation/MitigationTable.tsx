import React from 'react'

import { FastField, FieldArray, FieldArrayRenderProps, FormikErrors, FormikTouched, FormikValues } from 'formik'
import { useTranslation } from 'react-i18next'
import { Button, Row, Col } from 'reactstrap'

import { FaTrash, FaPlus } from 'react-icons/fa'

import { MitigationInterval, MitigationIntervals } from '../../../algorithms/types/Param.types'

import { suggestNextMitigationInterval } from '../../../algorithms/utils/createMitigationInterval'

import { MitigationDatePicker } from './MitigationDatePicker'
import { RangeSpinBox } from '../../Form/RangeSpinBox'

import { getFormikError } from '../../../helpers/getFormikError'

import './MitigationTable.scss'

export interface MitigationTableProps {
  mitigationIntervals: MitigationIntervals
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

export function MitigationTable({ mitigationIntervals, errors, touched }: MitigationTableProps) {
  const { t } = useTranslation()

  return (
    <FieldArray
      name="containment.mitigationIntervals"
      render={(arrayHelpers) => (
        <div className="mitigation-table">
          <p>
            The presets for the mitigation and infections control measure below are currently just place holders. We are
            gathering this information at the moment. For the time being please adjust, add, and remove to match your
            community.
          </p>
          <p>Each measure consists of name, start/end date, and an effectiveness in %.</p>

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

interface MitigationIntervalProps {
  index: number
  interval: MitigationInterval
  arrayHelpers: FieldArrayRenderProps
  errors?: FormikErrors<FormikValues>
  touched?: FormikTouched<FormikValues>
}

function MitigationIntervalComponent({ index, interval, arrayHelpers, errors, touched }: MitigationIntervalProps) {
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
    <Row noGutters className="mb-1">
      <Col xs={11} sm={11} md={11} lg={10} xl={11}>
        <Row noGutters className="pr-1 pr-sm-1 pr-md-1 pr-lg-1 pr-xl-1">
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <FastField
              className={`form-control ${nameError ? 'border-danger' : ''}`}
              id={`containment.mitigationIntervals[${index}].name`}
              name={`containment.mitigationIntervals[${index}].name`}
              type="text"
            />
          </Col>
          <Col xs="auto" sm="auto" md="auto" lg="5" xl="auto" className="align-self-center">
            <MitigationDatePicker
              identifier={`containment.mitigationIntervals[${index}].timeRange`}
              value={interval.timeRange}
              allowPast
            />
          </Col>
          <Col className="align-self-center">
            <RangeSpinBox
              identifier={`containment.mitigationIntervals[${index}].mitigationValue`}
              step={0.1}
              min={0}
              max={100}
            />
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            {nameError && <p className="my-0 text-right text-danger">{`${t('Intervention name')}: ${nameError}`}</p>}
            {valueError && (
              <p className="my-0 text-right text-danger">{`${t('Mitigation strength')}: ${valueError}`}</p>
            )}
          </Col>
        </Row>
      </Col>
      <Col className="align-self-center">
        <Button size="sm" onClick={() => arrayHelpers.remove(index)}>
          <FaTrash />
        </Button>
      </Col>
    </Row>
  )
}
