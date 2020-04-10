import React from 'react'

import _ from 'lodash'

import { FastField, FieldArray, FieldArrayRenderProps, FormikErrors, FormikTouched, FormikValues } from 'formik'
import { useTranslation } from 'react-i18next'
import { Button, Row, Col, FormGroup, InputGroup } from 'reactstrap'

import { FaTrash, FaPlus } from 'react-icons/fa'

import { MitigationInterval, MitigationIntervals } from '../../../algorithms/types/Param.types'

import { suggestNextMitigationInterval } from '../../../algorithms/utils/createMitigationInterval'

import { MitigationDatePicker } from './MitigationDatePicker'
import NumericInput from '../../Form/NumericInput'

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
    <Row>
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <p>
            The presets for the mitigation and infections control measure below are currently just place holders. We are
            gathering this information at the moment. For the time being please adjust, add, and remove to match your
            community.
          </p>
          <p>Each measure consists of name, start/end date, and an effectiveness in %.</p>
        </Col>
      </Row>
      <Row noGutters>
        <FieldArray
          name="containment.mitigationIntervals"
          render={(arrayHelpers) => (
            <>
              <Row noGutters>
                {mitigationIntervals.map((interval: MitigationInterval, index: number) => (
                  <Col key={interval.id} xs={12} sm={12} md={12} lg={12} xl={12}>
                    <MitigationIntervalComponent
                      interval={interval}
                      index={index}
                      arrayHelpers={arrayHelpers}
                      errors={errors}
                      touched={touched}
                    />
                  </Col>
                ))}
              </Row>
              <Row noGutters className="pl-2">
                <Button
                  type="button"
                  onClick={() => {
                    const interval = suggestNextMitigationInterval(mitigationIntervals)
                    arrayHelpers.push(interval)
                  }}
                >
                  {t('Add')} <FaPlus />
                </Button>
              </Row>
            </>
          )}
        />
      </Row>
    </Row>
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
    <FormGroup className="w-100 p-2">
      <Row noGutters style={{ background: '#ddd' }}>
        <Col xs="12" sm="12" md="12" lg="12" xl="12">
          <InputGroup className="align-items-center p-1 pr-1">
            <MitigationDatePicker
              identifier={`containment.mitigationIntervals[${index}].timeRange`}
              value={interval.timeRange}
              allowPast
            />
            <Button type="button" onClick={() => arrayHelpers.remove(index)} className="ml-auto">
              <FaTrash />
            </Button>
          </InputGroup>
        </Col>
        <Col xs="12" sm="12" md="12" lg="12" xl="12" className="align-self-center pl-1 pr-1">
          <FastField
            className={`name form-control ${nameError ? 'border-danger' : ''}`}
            id={`containment.mitigationIntervals[${index}].name`}
            name={`containment.mitigationIntervals[${index}].name`}
            type="text"
          />
        </Col>
        <Col xs="12" sm="12" md="12" lg="12" xl="12" className="align-self-center pl-1 pr-1 pb-1">
          <NumericInput
            className="form-control"
            label="Mitigation value"
            identifier={`containment.mitigationIntervals[${index}].mitigationValue`}
            name={`containment.mitigationIntervals[${index}].mitigationValue`}
            step={1}
            precision={2}
          />
        </Col>
      </Row>
      <Row>
        <Col xs="auto" sm="auto" md="auto" lg="auto" xl="auto">
          {nameError && <p className="my-0 text-right text-danger">{`${t('Intervention name')}: ${nameError}`}</p>}
          {valueError && <p className="my-0 text-right text-danger">{`${t('Mitigation strength')}: ${valueError}`}</p>}
        </Col>
      </Row>
    </FormGroup>
  )
}
